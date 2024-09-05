"use client";

import { useMediaQuery } from "react-responsive";

export default function Header() {
    const isDesktopOrLaptop = useMediaQuery({
        query: "(min-width: 1224px)",
    });

    return <footer>footer</footer>;
}
