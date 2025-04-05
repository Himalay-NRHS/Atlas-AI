"use client";
import QuizComponent from "@/components/quiz-component";
import { SessionProvider } from "next-auth/react";

export default  function  Home(){

    return(

        <>
           <SessionProvider>
        
        <QuizComponent/>
        </SessionProvider>
        </>
    )
}