"use client";

import React from "react";
import { LoaderIcon } from "lucide-react";
import { User } from "@/types";
import { AppConfig } from "@/config/img2text";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import Typed from "typed.js";
import { toast } from "sonner";

const HomePage = () => {
  const [data, setData] = React.useState<{ text: string } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [imgPreview, setImgPreview] = React.useState<string | null>(null);
  const fileRef = React.useRef<File | null>(null);
  const el = React.useRef(null);
  const [user, setUser] = React.useState<User>();

  React.useEffect(() => {
    if (!data) {
      return;
    }

    // const message = data.choices.map((choice) => choice.message.content).join('')

    const typed = new Typed(el.current, {
      strings: [data.text],
      typeSpeed: 1,
      // 不要 cursorChar: '_'
      showCursor: false,
    });

    return (): void => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, [data]);

  const previewFile = (imgFile: File | undefined): void => {
    if (imgFile) {
      // 檢查文件類型
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(imgFile.type)) {
        toast.error("請上傳 JPG 或 PNG 格式的圖片");
        // 清除文件
        setPreview(null);
        fileRef.current = null;
        const fileInput = document.getElementById("file") as HTMLInputElement;
        fileInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = (e): void => {
        setPreview(e.target?.result as string);
        fileRef.current = imgFile;
        console.log("file", fileRef.current);
      };
      reader.readAsDataURL(imgFile);
    } else {
      setPreview(null);
      fileRef.current = null;
      const fileInput = document.getElementById("file") as HTMLInputElement;
      fileInput.value = "";
    }
  };

  const handleImgSubmit = async (): Promise<void> => {
    if (fileRef.current) {
      setLoading(true);
      setImgPreview(preview);
      setPreview(null);
      const formData = new FormData();
      formData.append("image", fileRef.current);
      formData.append("Token", "0UET8Lal6hBBqNSE");
      try {
        const res = await fetch(`${AppConfig.serviceApiUrl}/describe-image`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setData(data);
        console.log("設置 data", data);
      } catch (error) {
        console.error("Error submitting image:", error);
        toast.error("提交圖片時發生錯誤");
      } finally {
        setLoading(false);
        fileRef.current = null;
        const fileInput = document.getElementById("file") as HTMLInputElement;
        fileInput.value = "";
      }
    } else {
      toast.error("請選擇檔案");
    }
  };

  return (
    <div className="h-screen flex flex-col px-2 pb-2">
      <div className="border-b -mx-2 flex justify-between items-center p-2">
        {/* <img src={Logo} alt="logo" /> */}
        {/* msi translate */}
        <h1 className="text-2xl font-bold">圖意探險家</h1>
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
      <div className="flex-1 overflow-y-auto mb-4 mt-2">
        <div className="flex w-full">
          {loading ? (
            <Skeleton className="w-full h-4 bg-gray-300 rounded-lg" />
          ) : (
            // <p className="text-black w-full">{data?.text}</p>
            <span className="w-full" ref={el} />
          )}
          {imgPreview && (
            <div className="w-1/3">
              <img src={imgPreview} alt="imgPreview" className="object-cover" />
            </div>
          )}
        </div>
      </div>
      {preview && (
        <div className="fixed inset-x-6 bottom-20">
          <img
            src={preview}
            alt="preview"
            className="w-auto h-[45vh] object-cover"
          />
        </div>
      )}
      <div className="mt-auto">
        <div className="flex justify-between gap-2">
          <Input
            id="file"
            type="file"
            accept=".jpg,.png"
            className="flex-grow cursor-pointer"
            onChange={(e) => previewFile(e.target.files?.[0])}
          />
          <Button
            onClick={handleImgSubmit}
            variant="default"
            // 載入中禁止點擊
            className={clsx("w-20", loading && "cursor-not-allowed")}
          >
            {loading ? <LoaderIcon /> : "送出"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
