"use client";

import { Button } from "@/components/ui/button";
import { BotIcon, LanguagesIcon, SendHorizontalIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { AppConfig, translateConfig } from "@/config/translate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/types";
// import Logo from '@/assets/msiChatbot_logo_black.png'

const HomePage = () => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [userMessage, setUserMessage] = React.useState<string>("");
  const [userInput, setUserInput] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");
  const [sourceLanguage, setSourceLanguage] = React.useState<string>(
    translateConfig.default_source_language.code
  );
  const [targetLanguage, setTargetLanguage] = React.useState<string>(
    translateConfig.default_target_language.code
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<User>();

  const handleSendMessage = async () => {
    const input = inputRef.current?.value;

    if (!input?.trim()) {
      toast.error("請輸入訊息");
      return;
    }

    setMessage("");
    setUserMessage(input);
    inputRef.current!.value = "";
    setUserInput("");
    setIsLoading(true);
    // http://172.16.111.148:8090/translate
    const res = await fetch(`${AppConfig.serviceApiUrl}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: input,
        source_language_code: sourceLanguage,
        target_language_code: targetLanguage,
        Token: "0UET8Lal6hBBqNSE",
      }),
    });

    const data = await res.json();
    setMessage(data.output);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [userInput]);

  return (
    <div className="h-screen flex flex-col px-2 pb-2">
      <div className="border-b -mx-2 flex justify-between items-center p-2">
        {/* <img src={Logo} alt="logo" /> */}
        {/* msi translate */}
        <h1 className="text-2xl font-bold">msi translate</h1>
        {/* {user ? (
          <div className="flex gap-4 items-center">
            <div className="text-xl">您好! {user.ChineseName}</div>
            <Button
              onClick={() => {
                localStorage.removeItem("token");
                setUser(undefined);
              }}
            >
              登出
            </Button>
          </div>
        ) : (
          <Button onClick={() => navigate("/login")}>登入</Button>
        )} */}
      </div>
      <div className="flex-1 p-2 flex flex-col gap-2 container mx-auto">
        {userMessage && (
          <div className="flex justify-end ml-10">
            <div className="bg-secondary p-2 rounded-xl inline-block">
              {userMessage}
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex gap-2 justify-end items-center">
            <div className="rounded-full bg-red-300 w-8 h-8 flex items-center justify-center">
              <BotIcon />
            </div>
            <div className="flex-1">
              <div className="bg-red-300 p-2 rounded-full w-5 h-5 animate-bounce"></div>
            </div>
          </div>
        )}
        {message && (
          <div className="flex gap-2 justify-end">
            <div className="rounded-full bg-red-300 w-8 h-8 flex items-center justify-center">
              <BotIcon />
            </div>
            <div className="flex-1 flex-col flex gap-2">
              <div className="bg-red-300 p-2 rounded-xl">{message}</div>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 items-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <LanguagesIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>選擇語言</DialogTitle>
              <DialogDescription>
                選擇要翻譯的語言和翻譯後的語言
              </DialogDescription>
            </DialogHeader>
            <Label>原文語言</Label>
            <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
              <SelectTrigger>
                <SelectValue>
                  {
                    translateConfig.languages.find(
                      (item) => item.code === sourceLanguage
                    )?.label
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {translateConfig.languages.map((item) => (
                  <SelectItem key={item.code} value={item.code}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label>翻譯語言</Label>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger>
                <SelectValue>
                  {
                    translateConfig.languages.find(
                      (item) => item.code === targetLanguage
                    )?.label
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {translateConfig.languages.map((item) => (
                  <SelectItem key={item.code} value={item.code}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DialogContent>
        </Dialog>
        {/* <Input type="text" id="input" ref={inputRef} /> */}
        <Textarea
          id="input"
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          rows={1}
          value={userInput}
          className="resize-none min-h-10 max-h-20 overflow-y-auto flex-1"
          placeholder="輸入訊息，按 Shift + Enter 換行，按 Enter 傳送"
        />
        <Button type="submit" onClick={handleSendMessage}>
          <SendHorizontalIcon />
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
