import { useEffect, useRef, useState } from "react";

export default function Game() {
  const sceneRef = useRef(null);
  const [sceneWidth, setSceneWidth] = useState(0);  // Width game scene
  const [sceneHeight, setSceneHeight] = useState(0); // Height game scene
  const [sceneHeightLimitTop, setSceneHeightLimitTop] = useState(0); // Game scene limit top
  const [sceneHeightLimitBottom, setSceneHeightLimitBottom] = useState(0); // Game scene limit bottom

  const [rightPoints, setRightPoints] = useState(0); // Right points
  const [leftPoints, setLeftPoints] = useState(0); // Left points

  const [circleDirectionX, setCircleDirectionX] = useState(0); // 0: Left, 1: Right
  const [circleDirectionY, setCircleDirectionY] = useState(0); // 0: Top, 1: Bottom
  const [axisX, setAxisX] = useState(0); // CircleStepX
  const [axisY, setAxisY] = useState(0); // CircleStepY
  const [axisYSpeed, setAxisYSpeed] = useState(2); // CircleStepY

  const [barRightY, setBarRightY] = useState(0); // Bar direction Y
  const [barLeftY, setBarLeftY] = useState(0); // Bar direction Y

  const [onGameOver, setOnGameOver] = useState(true); // State of game
  const keysPressed = useRef({});
  const animationFrameId = useRef(null);
  const barRightYRef = useRef(barRightY);
  const barLeftYRef = useRef(barLeftY);
  const onGameOverRef = useRef(onGameOver);

  useEffect(() => { barRightYRef.current = barRightY }, [barRightY]);
  useEffect(() => { barLeftYRef.current = barLeftY }, [barLeftY]);
  useEffect(() => { onGameOverRef.current = onGameOver }, [onGameOver]);

  useEffect(() => {
    if (sceneRef.current) {
      setSceneWidth(sceneRef.current.offsetWidth); // Set area game width
      setSceneHeight(sceneRef.current.offsetHeight); // Set area game height

      // Limt to set bars, height bars is 25%, posisition center, then of center to top or bottom we move n px in y to: limit - (heightLimitTop or heightLimitBottom)  
      const heightLimitTop = ((sceneRef.current.offsetHeight - (62.5 * sceneRef.current.offsetHeight) / 100) * -1); // Areagame - (62.5%AreaGame) * -1 
      const heightLimitBottom = ((sceneRef.current.offsetHeight - (62.5 * sceneRef.current.offsetHeight) / 100)); // Areagame - (62.5%AreaGame)
      setSceneHeightLimitTop(heightLimitTop); // Set top limit to move bars
      setSceneHeightLimitBottom(heightLimitBottom); // Set bottom limit to move bars
    }

    const timer = setTimeout(() => {
      if (onGameOver) { return }

      if (circleDirectionX === 0) {
        setAxisX((prev) => prev - 10); // Direction right 
      } else {
        setAxisX((prev) => prev + 10); // Direction left
      }

      if (circleDirectionY === 0) {
        setAxisY((prev) => prev - axisYSpeed); // Direction top
      } else {
        setAxisY((prev) => prev + axisYSpeed); // Direction bottom
      }
    }, 10);

    return () => clearTimeout(timer);
  }, [axisX]);

  useEffect(() => {
    if (onGameOver) { return }

    // axisX > width game scene right && circle is in the same position than the right bar
    if (axisX > (sceneWidth / 2) - 20 && axisY > (barRightY - (12.5 * sceneHeight) / 100) && axisY < (barRightY + (12.5 * sceneHeight) / 100)) {
      setCircleDirectionX(0); // Change direction ball to left

      // Change velocity depending of ubication of bar bounce
      if (axisY > (barRightY - (1 * sceneHeight) / 100) && axisY < (barRightY + (1 * sceneHeight) / 100)) {
        setAxisYSpeed(0);
      } else if (axisY > (barRightY - (7.25 * sceneHeight) / 100) && axisY < (barRightY + (7.25 * sceneHeight) / 100)) {
        setAxisYSpeed(1);
      } else {
        setAxisYSpeed(4);
      }

      // Change direction of circleY dependig if the bounce is in the top or bottom of the bar
      if (axisY > (barRightY - (12.5 * sceneHeight) / 100) && axisY < (barRightY + (0 * sceneHeight) / 100)) {
        setCircleDirectionY(0); // Bounce in bottom
      } else {
        setCircleDirectionY(1); // Bounce in top
      }
    } else if (axisX > (sceneWidth / 2)) {
      setLeftPoints((prev) => prev + 1); // Left +1 Point
      GameOver();
    }

    // axisX > width game scene left && circle is in the same position than the left bar
    if (axisX < ((sceneWidth / 2) * -1) + 20 && axisY > (barLeftY - (12.5 * sceneHeight) / 100) && axisY < (barLeftY + (12.5 * sceneHeight) / 100)) {
      setCircleDirectionX(1); // Change direction ball to right

      // Change velocity depending of ubication of bar bounce
      if (axisY > (barLeftY - (1 * sceneHeight) / 100) && axisY < (barLeftY + (1 * sceneHeight) / 100)) {
        setAxisYSpeed(0);
      } else if (axisY > (barLeftY - (7.25 * sceneHeight) / 100) && axisY < (barLeftY + (7.25 * sceneHeight) / 100)) {
        setAxisYSpeed(1);
      } else {
        setAxisYSpeed(4);
      }

      // Change direction of circleY dependig if the bounce is in the top or bottom of the bar
      if (axisY > (barLeftY - (12.5 * sceneHeight) / 100) && axisY < (barLeftY + (0 * sceneHeight) / 100)) {
        setCircleDirectionY(0); // Bounce in bottom
      } else {
        setCircleDirectionY(1); // Bounce in top
      }
    } else if (axisX < ((sceneWidth / 2) * -1)) {
      setRightPoints((prev) => prev + 1); // Right +1 point
      GameOver();
    }

    // axisY < or > height game scene - or + 5px
    if (axisY > (sceneHeight / 2) - 5) {
      setCircleDirectionY(0); // Change direction ball to bottom
    } else if (axisY < ((sceneHeight / 2) * -1) + 5) {
      setCircleDirectionY(1); // Change direction ball to top
    }
  }, [axisX, axisY]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    const update = (e) => {
      const moveSpeed = 5;
      if (keysPressed.current["ArrowUp"] && barRightYRef.current > sceneHeightLimitTop) {
        if ((barRightY - moveSpeed) < sceneHeightLimitTop) {
          setBarRightY(prev => {
            const newY = prev - ((sceneHeightLimitTop - barRightY) * -1);
            barRightYRef.current = newY;
            return newY;
          });
        } else {
          setBarRightY(prev => {
            const newY = prev - moveSpeed;
            barRightYRef.current = newY;
            return newY;
          });
        }
      }
      if (keysPressed.current["ArrowDown"] && barRightYRef.current < sceneHeightLimitBottom) {
        if ((barRightY + moveSpeed) > (sceneHeightLimitTop * -1)) {
          setBarRightY(prev => {
            const newY = prev + ((sceneHeightLimitTop * -1) - barRightY);
            barRightYRef.current = newY;
            return newY;
          });
        } else {
          setBarRightY(prev => {
            const newY = prev + moveSpeed;
            barRightYRef.current = newY;
            return newY;
          });
        }
      }

      if (keysPressed.current["w"] && barLeftYRef.current > sceneHeightLimitTop) {
        if ((barLeftY - moveSpeed) < sceneHeightLimitTop) {
          setBarLeftY(prev => {
            const newY = prev - ((sceneHeightLimitTop - barLeftY) * -1);
            barLeftYRef.current = newY;
            return newY;
          });
        } else {
          setBarLeftY(prev => {
            const newY = prev - moveSpeed;
            barLeftYRef.current = newY;
            return newY;
          });
        }
      }
      if (keysPressed.current["s"] && barLeftYRef.current < sceneHeightLimitBottom) {
        if ((barLeftY + moveSpeed) > (sceneHeightLimitTop * -1)) {
          setBarLeftY(prev => {
            const newY = prev + ((sceneHeightLimitTop * -1) - barLeftY);
            barLeftYRef.current = newY;
            return newY;
          });
        } else {
          setBarLeftY(prev => {
            const newY = prev + moveSpeed;
            barLeftYRef.current = newY;
            return newY;
          });
        }
      }

      if (keysPressed.current[" "] && onGameOverRef.current) {
        StartGame();
      }

      animationFrameId.current = requestAnimationFrame(update);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [barRightY, barLeftY, sceneHeightLimitTop, sceneHeightLimitBottom, onGameOver]);

  const StartGame = () => {
    setOnGameOver(false);
    setAxisX(1);
    setAxisY(1);
    setCircleDirectionX(1);
    setCircleDirectionY(1);
  }

  const GameOver = () => {
    setOnGameOver(true);
    setAxisX(0);
    setAxisY(0);
    setCircleDirectionX(0);
    setCircleDirectionY(0);
  }

  return (
    <div
      ref={sceneRef}
      className="text-[#cdd6f4] flex items-center justify-center w-full h-full relative select-none"
    >
      {/* Info */}
      <div className={`${onGameOver ? "hidden lg:block aboslute flex flex-col text-center mt-24 font-bold animate-pulse" : "hidden"}`}>
        <div>START GAME [SPACE]</div>
        <div>OPTIONS [O]</div>
      </div>
      <button onClick={StartGame} className={`${onGameOver ? "absolute lg:hidden bg-black/10 dark:bg-[#45475a] px-2 py-1 rounded-md mt-16 font-bold animate-pulse cursor-pointer" : "hidden"}`}>START</button>
      
      {/* Ball */}
      <div
        className="absolute bg-[#585b70] w-4 h-4 rounded-full"
        style={{ transform: `translate(${axisX}px, ${axisY}px)` }}
      ></div>

      {/* Bars */}
      <div
        className="absolute right-0 w-1 h-1/4 bg-[#585b70] rounded-2xl"
        style={{ transform: `translateY(${barRightY}px)` }}
      ></div>
      <span className={`${onGameOver ? "absolute right-10 text-9xl" : "hidden"}`}>{rightPoints}</span>

      <div
        className="absolute left-0 w-1 h-1/4 bg-[#585b70] rounded-2xl"
        style={{ transform: `translateY(${barLeftY}px)` }}
      ></div>
      <span className={`${onGameOver ? "absolute left-10 text-9xl" : "hidden"}`}>{leftPoints}</span>

      {/* Small screens buttons */}
      <div className="absolute lg:hidden bottom-0 left-0 flex gap-1">
        <button className="px-5 py-3"
          onMouseDown={() => keysPressed.current["s"] = true}
          onMouseUp={() => keysPressed.current["s"] = false}
          onTouchStart={() => keysPressed.current["s"] = true}
          onTouchEnd={() => keysPressed.current["s"] = false}
        ><i className="bi bi-chevron-down "></i></button>

        <button className="px-5 py-3"
          onMouseDown={() => keysPressed.current["w"] = true}
          onMouseUp={() => keysPressed.current["w"] = false}
          onTouchStart={() => keysPressed.current["w"] = true}
          onTouchEnd={() => keysPressed.current["w"] = false}
        ><i className="bi bi-chevron-up "></i></button>
      </div>

      <div className="absolute lg:hidden bottom-0 right-0 flex gap-1">
        <button className="px-5 py-3"
          onMouseDown={() => keysPressed.current["ArrowDown"] = true}
          onMouseUp={() => keysPressed.current["ArrowDown"] = false}
          onTouchStart={() => keysPressed.current["ArrowDown"] = true}
          onTouchEnd={() => keysPressed.current["ArrowDown"] = false}
        ><i className="bi bi-chevron-down "></i></button>


        <button className="px-5 py-3"
          onMouseDown={() => keysPressed.current["ArrowUp"] = true}
          onMouseUp={() => keysPressed.current["ArrowUp"] = false}
          onTouchStart={() => keysPressed.current["ArrowUp"] = true}
          onTouchEnd={() => keysPressed.current["ArrowUp"] = false}
        ><i className="bi bi-chevron-up "></i></button>
      </div>
    </div>
  );
}
