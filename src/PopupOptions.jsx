export default function PopupOptions({
  popupIsOpen,
  onClose 
}) {
  if (!popupIsOpen) return null;
  return (
    <dialog open={popupIsOpen} className="bg-black/15 text-[#cdd6f4] fixed top-0 flex items-center justify-center w-screen h-screen z-1">
      <div className="bg-[#313244] w-[300px] border-1 border-[#89b4fa] h-[300px] rounded-xl p-2">
        <button type="button" onClick={onClose}>Close</button>
      </div>
    </dialog>
  );
}
