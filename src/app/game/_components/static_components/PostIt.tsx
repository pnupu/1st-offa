import Image from "next/image";

const PostIt = () => {

  return (
    <div className="w-full h-full flex items-center justify-center" onClick={() => console.log("POSTIT")}>
      <Image src="/assets/desktop/Post-it.svg" alt="PostIt" className="w-full h-full object-contain" draggable="false" layout="fill" />
    </div>
  );
}

export default PostIt;