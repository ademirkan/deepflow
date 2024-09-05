"use client";

const CircularProgress = ({
    filledPercent = 100,
    animationDuration = "1s",
    animationTimingFunction = "linear",
    clockwise = false,
    thickness = 0.1,
    primaryColor = "red",
    secondaryColor = "gray",
    backgroundColor = "white",
}) => {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                height="inherit"
                width="inherit"
            >
                <circle cx="50" cy="50" r="50" fill={secondaryColor} />
                <circle
                    cx="50"
                    cy="50"
                    r="25"
                    fillOpacity={0}
                    stroke={primaryColor}
                    strokeWidth="50"
                    strokeDasharray={`${filledPercent * 157.08} 157.08`}
                    style={{
                        transition: `${animationDuration} ${animationTimingFunction}`,
                    }}
                    transform="rotate(-90) translate(-100)"
                />
                <circle
                    cx="50"
                    cy="50"
                    r={50 - 50 * thickness}
                    fill={backgroundColor}
                />
            </svg>
        </>
    );
};

export default CircularProgress;
