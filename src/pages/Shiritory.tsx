import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Input } from "antd";
import { useEffect, useState } from "react";
import { checkValidWord } from "../services/wordCheck";

export default function Shiritory() {
  const [user, setUser] = useState(1);
  const [inputWord1, setInputWord1] = useState<string>("");
  const [inputWord2, setInputWord2] = useState<string>("");
  const [firstUserWord, setFirstUserWord] = useState<string[]>([]);
  const [secondUserWord, setSecondUserWord] = useState<string[]>([]);
  const [point, setPoint] = useState<{ user1: number; user2: number }>({
    user1: 20,
    user2: 20,
  });
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");
  const [countDown, setCountDown] = useState<number>(10);
  const [currentChar, setCurrentChar] = useState("s");

  const handleCheckWord = (word: string) => {
    if (user === 1) {
      setInputWord1(word);
      setError1("");
    } else {
      setInputWord2(word);
      setError2("");
    }
    if (
      word.length > 0 &&
      word[0].toLocaleLowerCase() !== currentChar.toLowerCase()
    ) {
      if (user === 1) {
        setError1(`Must Start with '${currentChar}'`);
      } else {
        setError2(`Must Start with '${currentChar}'`);
      }
    }
  };
  const handleEnter = async () => {
    if (
      (inputWord1.length < 4 && user === 1) ||
      (inputWord2.length < 4 && user === 2)
    ) {
      if (user === 1) {
        setError1("Must have at-least 4 characters");
      } else {
        setError2("Must have at-least 4 characters");
      }
      return;
    }

    const ans = await checkValidWord(user === 1 ? inputWord1 : inputWord2);
    if (ans) {
      if (user === 1) {
        const WordList = [...firstUserWord];
        const isNowWord = WordList.find((word: string) => word === inputWord1);
        if (!isNowWord) {
          setFirstUserWord([...WordList, inputWord1]);
          setInputWord1("");
          setUser(2);
          setPoint({ ...point, user1: point.user1 - inputWord1.length });
          setCurrentChar(inputWord1[inputWord1.length - 1]);
          setCountDown(10);
        } else {
          setError1(`${inputWord1} word already used...!`);
        }
      } else {
        const WordList = [...secondUserWord];
        const isNowWord = WordList.find((word: string) => word === inputWord2);
        if (!isNowWord) {
          setSecondUserWord([...WordList, inputWord2]);
          setInputWord2("");
          setUser(1);
          setPoint({ ...point, user2: point.user2 - inputWord2.length });
          setCurrentChar(inputWord2[inputWord2.length - 1]);
          setCountDown(10);
        } else {
          setError2(`${inputWord2} word already used...!`);
        }
      }
    } else {
      if (user === 1) {
        setError1("Word Not Fount...!");
      } else {
        setError2("Word Not Fount...!");
      }
    }
  };

  const handleTurnSwitch = () => {
    if (user === 1) {
      setUser(2);
      setPoint({ ...point, user1: point.user1 + 1 });
    } else {
      setUser(1);
      setPoint({ ...point, user2: point.user2 + 1 });
    }
    setCountDown(10);
    setInputWord1("");
    setInputWord2("");
  };

  useEffect(() => {
    
      const interval = setInterval(() => {
      
          setCountDown((prev) => {
          if (prev <= 1) {
            handleTurnSwitch();
            // return 10;
          }
          return prev - 1;
        });
      
        
      }, 1000);
      return () => clearInterval(interval);
    
  }, [user]);

  useEffect(() => {
    if (point.user1 < 0 || point.user2 < 0) {
      setFlag(false);
      if (point.user1 < 0) {
        setWin("User 1 Win...!");
      } else {
        setWin("User 2 Win...!");
      }
    }
  }, [point]);

  const [win, setWin] = useState("");
  const [flag, setFlag] = useState(false);

  const handleIsStart = () => {
    setFlag((p) => !p);
    setCountDown(10);
    setFirstUserWord([]);
    setSecondUserWord([]);
    setError1("");
    setError1("");
  };

  return (
    <div>
      {win.length ? (
        <div className="bg-gray-300 p-5">{win}</div>
      ) : (
        <div>
          {flag ? (
            <div className="flex gap-5 justify-center items-center">
              <div>
                <div className="flex justify-center items-center py-3 gap-1">
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#87d068" }}
                  ></Avatar>
                  <p className="text-2xl">User 1</p>
                </div>
                <Card className="bg-gray-200" bordered={false}>
                  <div className="flex flex-row justify-between items-center py-2">
                    <p className="text-xl py-2">Point: {point.user1}</p>
                    <p
                      className={`${
                        user == 1
                          ? "text-md bg-gray-300 text-white rounded-full py-1 px-3"
                          : ""
                      }`}
                    >
                      {user == 1 ? `Time Left: ${countDown}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      disabled={user == 2}
                      value={inputWord1}
                      onChange={(e) => handleCheckWord(e.target.value)}
                    ></Input>
                    <Button disabled={user == 2} onClick={handleEnter}>Enter</Button>
                  </div>
                  {error1 && <p className="text-red-400 ">{error1}</p>}
                  <div className="py-2">
                    {firstUserWord.map((word, index) => (
                      <div
                        className="border bg-white p-1 flex justify-between items-center "
                        key={index}
                      >
                        <p>{word}</p>
                        <p className="pe-2">{word.length}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              <div>
                <div className="flex justify-center items-center py-3 gap-1">
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#f56a00" }}
                  ></Avatar>
                  <p className="text-2xl">User 2</p>
                </div>
                <Card
                  className="bg-gray-100"
                  bordered={false}
                  style={{ width: 300 }}
                >
                  <div className="flex flex-row justify-between items-center py-2">
                    <p className="text-xl py-2">Point: {point.user2}</p>
                    <p
                      className={`${
                        user == 2
                          ? "text-md bg-gray-300 text-white rounded-full py-1 px-3"
                          : ""
                      }`}
                    >
                      {user == 2 ? `Time Left: ${countDown}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      disabled={user == 1}
                      value={inputWord2}
                      onChange={(e) => handleCheckWord(e.target.value)}
                    ></Input>
                    <Button disabled={user == 1} onClick={handleEnter}>Enter</Button>
                  </div>
                  {error2 && <p className="text-red-400 ">{error2}</p>}
                  <div className="py-2">
                    {secondUserWord.map((word, index) => (
                      <div
                        className="border bg-white p-1 flex justify-between items-center"
                        key={index}
                      >
                        <p>{word}</p>
                        <p className="pe-2">{word.length}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <Button type="primary" onClick={handleIsStart}>
              Start Game
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
