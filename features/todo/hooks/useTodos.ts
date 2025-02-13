"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "@/types/todo";
import todoService from "@/service/todo";
import useAuthStore from "@/store/auth";

function useTodos() {
    const { user, loading: authLoading } = useAuthStore();

    const queryClient = useQueryClient();

    // Fetch todos when a user is authenticated.
    const { data, isLoading, error } = useQuery<Todo[]>({
        queryKey: ["todos", user?.uid],
        queryFn: () => todoService.fetchAllTodos(),
        enabled: !!user?.uid,
    });

    const todos = data ?? [];

    // Sort todos by completed status and updatedAt date.
    const sortedTodos = todos.sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return a.updatedAt.getTime() - b.updatedAt.getTime();
    });

    // Mutation to toggle a todo's completion status.
    const statusMutation = useMutation({
        mutationFn: ({ id, newStatus }: { id: string; newStatus: boolean }) =>
            todoService.updateTodoCompletion(id, newStatus),
        onMutate: ({ id, newStatus }) => {
            // Retrieve the previous state.
            const previousTodos = queryClient.getQueryData<Todo[]>([
                "todos",
                user?.uid,
            ]);

            // Optimistically update the completed status.
            queryClient.setQueryData<Todo[]>(
                ["todos", user?.uid],
                (old: Todo[] | undefined) =>
                    old?.map((todo) =>
                        todo.id === id
                            ? {
                                  ...todo,
                                  completed: newStatus,
                                  updatedAt: new Date(),
                              }
                            : todo
                    ) ?? []
            );
            return { previousTodos };
        },
        onError: (err, variables, context) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(
                    ["todos", user?.uid],
                    context.previousTodos
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos", user?.uid] });
        },
    });

    // Mutation to update a todo's text.
    const editTextMutation = useMutation({
        mutationFn: ({ id, text }: { id: string; text: string }) =>
            todoService.updateTodoText(id, text),
        onMutate: ({ id, text }: { id: string; text: string }) => {
            const previousTodos = queryClient.getQueryData<Todo[]>([
                "todos",
                user?.uid,
            ]);

            queryClient.setQueryData<Todo[]>(
                ["todos", user?.uid],
                (old: Todo[] | undefined) =>
                    old?.map((todo) =>
                        todo.id === id
                            ? { ...todo, text, updatedAt: new Date() }
                            : todo
                    ) ?? []
            );
            return { previousTodos };
        },
        onError: (
            err: Error,
            variables: { id: string; text: string },
            context: any
        ) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(
                    ["todos", user?.uid],
                    context.previousTodos
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos", user?.uid] });
        },
    });

    // Mutation to add a new todo.
    const addMutation = useMutation({
        mutationFn: (text: string) => todoService.createTodo(text),
        onMutate: (text: string) => {
            if (!user?.uid) {
                throw new Error("User not authenticated");
            }

            const previousTodos = queryClient.getQueryData<Todo[]>([
                "todos",
                user?.uid,
            ]);
            const tempId = Date.now().toString();
            const optimisticTodo: Todo = {
                id: tempId,
                text,
                completed: false,
                uid: user.uid,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            queryClient.setQueryData<Todo[]>(["todos", user?.uid], (old) =>
                old ? [...old, optimisticTodo] : [optimisticTodo]
            );
            return { previousTodos, tempId };
        },
        onError: (err, text, context: any) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(
                    ["todos", user?.uid],
                    context.previousTodos
                );
            }
        },
        onSuccess: (newTodo, text, context: any) => {
            queryClient.setQueryData<Todo[]>(
                ["todos", user?.uid],
                (old) =>
                    old?.map((todo) =>
                        todo.id === context?.tempId ? newTodo : todo
                    ) ?? []
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos", user?.uid] });
        },
    });

    // Mutation to delete a todo.
    const deleteMutation = useMutation({
        mutationFn: (id: string) => todoService.deleteTodo(id),
        onMutate: (id: string) => {
            const previousTodos = queryClient.getQueryData<Todo[]>([
                "todos",
                user?.uid,
            ]);
            queryClient.setQueryData<Todo[]>(
                ["todos", user?.uid],
                (old: Todo[] | undefined) =>
                    old?.filter((todo) => todo.id !== id) ?? []
            );
            return { previousTodos };
        },
        onError: (err, id, context) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(
                    ["todos", user?.uid],
                    context.previousTodos
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos", user?.uid] });
        },
    });

    // Utility functions to trigger mutations.
    const toggleTodo = (id: string, newStatus: boolean) => {
        statusMutation.mutate({ id, newStatus });
    };

    const editTodo = (id: string, text: string) => {
        editTextMutation.mutate({ id, text });
    };

    const addTodo = (text: string) => {
        addMutation.mutate(text);
    };

    const deleteTodo = (id: string) => {
        deleteMutation.mutate(id);
    };

    return {
        todos: sortedTodos,
        isLoading:
            isLoading ||
            authLoading ||
            addMutation.isPending ||
            statusMutation.isPending ||
            deleteMutation.isPending ||
            editTextMutation.isPending,
        isError: !!error,
        toggleTodo,
        editTodo,
        addTodo,
        deleteTodo,
    };
}

export default useTodos;
