'use client'

import LoginForm from "@/components/forms/loginForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return(
    <div className="flex max-h-screen h-screen">

    {/* TODO: OTP 인증 페이지 추가 */}

      <section className="container my-auto">
        <div className="sub-container max-w-[200px]">
          <Image
            src="/assets/icons/vs_logo.png"
            alt="logo"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
          />
        </div>
        <LoginForm />
        <div className="text-14-regular">
          <Link href="/?admin=true">관리자 로그인</Link>
        </div>
      </section>
      <section className="container my-auto"></section>
    </div>
  )
}
