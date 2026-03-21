export default function LoadingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="w-1.5 h-1.5 bg-[#71717a] rounded-full animate-bounce [animation-delay:0ms]"></span>
      <span className="w-1.5 h-1.5 bg-[#71717a] rounded-full animate-bounce [animation-delay:150ms]"></span>
      <span className="w-1.5 h-1.5 bg-[#71717a] rounded-full animate-bounce [animation-delay:300ms]"></span>
    </span>
  );
}
