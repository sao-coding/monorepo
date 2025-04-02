"use client";

import { Button } from "@/components/ui/button";
import { BotIcon, LanguagesIcon, SendHorizontalIcon } from "lucide-react";
import React from "react";
import { AppConfig, translateConfig } from "@/config/asr";
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
import { Input } from "@/components/ui/input";
import { User } from "@/types";
import { toast } from "sonner";

const AsrPage = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [message, setMessage] = React.useState<string>("");
  const [language, setLanguage] = React.useState<string>(
    translateConfig.default_language
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<User>();

  const handleSendMessage = async () => {
    const inputFile = inputRef?.current?.files?.[0] as File;
    console.log("input:", inputFile);

    if (!inputFile) {
      toast.error("請選擇音檔");
      return;
    }

    setMessage("");
    setIsLoading(true);
    // http://172.16.111.148:8090/asr
    // form-data
    const formData = new FormData();
    formData.append("file", inputFile);
    formData.append("language-code", language);
    formData.append("Token", "0UET8Lal6hBBqNSE");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    const res = await fetch(`${AppConfig.serviceApiUrl}/asr`, {
      method: "POST",
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      body: formData,
    });
    // 輸出音檔
    const data = await res.json();
    if (!res.ok) {
      console.error("error:", data);
      if (data.error.includes("Input audio channel count must be 1")) {
        toast.error("請確認音檔是否為單聲道");
      } else {
        toast.error(data.error);
      }
    }
    console.log("data:", data);

    setMessage(data.output);
    setIsLoading(false);
  };

  return (
    <div className="h-screen flex flex-col px-2 pb-2">
      <div className="border-b -mx-2 flex justify-between items-center p-2">
        <h1 className="text-2xl font-bold">音頻文字機</h1>
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
      <div className="text-sm text-red-500">目前只支援單聲道音檔</div>
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
            <Label>輸入語言</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue>
                  {
                    translateConfig.languages.find(
                      (item) => item.code === language
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
        {/* 音檔 */}
        <Input type="file" id="input" ref={inputRef} accept=".wav" />
        <Button type="submit" onClick={handleSendMessage}>
          <SendHorizontalIcon />
        </Button>
      </div>
    </div>
  );
};

export default AsrPage;
