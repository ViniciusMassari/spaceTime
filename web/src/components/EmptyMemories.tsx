import React from "react";

const EmptyMemories = () => {
  return (
    <div className="flex flex-1 items-center justify-center p-16">
      <p className="w-[360px] text-center leading-relaxed">
        Você ainda não registrou nenhuma lembrança, comece a{" "}
        <a
          href="/memories/new"
          className="underline transition duration-200 hover:text-gray-50"
        >
          {" "}
          criar agora!{" "}
        </a>
      </p>
    </div>
  );
};

export default EmptyMemories;
