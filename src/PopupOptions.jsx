export default function PopupOptions({
	popupIsOpen,
	onClose,
	axisXSpeed,
	setAxisXSpeedInGame,
	axisYSpeed,
	setAxisYSpeedInGame,
	barMoveSpeed,
	ballFrames,
	setAxisXSpeed,
	setAxisYSpeed,
	setBarMoveSpeed,
	setBallFrames,
}) {
	if (!popupIsOpen) return null;

	return (
		<dialog
			open={popupIsOpen}
			className="bg-black/15 accent-[#89b4fa] text-[#cdd6f4] fixed top-0 flex items-center justify-center w-screen h-screen z-10"
		>
			<div className="bg-[#313244] w-[320px] border border-[#89b4fa] rounded-xl p-4 flex flex-col gap-3">
				<h2 className="text-lg font-bold text-center mb-2">Game options</h2>

				<label className="flex flex-col text-sm">
					Ball Speed X
					<input
						className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
						type="range"
						min="1"
						max="30"
						value={axisXSpeed}
						onChange={(e) => {
							setAxisXSpeed(Number(e.target.value));
							setAxisXSpeedInGame(Number(e.target.value));
						}}
					/>
					<span>{axisXSpeed}</span>
				</label>

				<label className="flex flex-col text-sm">
					Ball Speed Y
					<input
						className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
						type="range"
						min="0"
						max="10"
						value={axisYSpeed}
						onChange={(e) => {
							setAxisYSpeed(Number(e.target.value));
							setAxisYSpeedInGame(Number(e.target.value));
						}}
					/>
					<span>{axisYSpeed}</span>
				</label>

				<label className="flex flex-col text-sm">
					Bars Speed
					<input
						className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
						type="range"
						min="1"
						max="20"
						value={barMoveSpeed}
						onChange={(e) => setBarMoveSpeed(Number(e.target.value))}
					/>
					<span>{barMoveSpeed}</span>
				</label>

				<label className="flex flex-col text-sm">
					Ball Frames
					<input
						className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
						type="range"
						min="1"
						max="50"
						value={ballFrames}
						onChange={(e) => setBallFrames(Number(e.target.value))}
					/>
					<span>{ballFrames}</span>
				</label>

				<button
					type="button"
					onClick={onClose}
					className="mt-3 bg-[#89b4fa] text-[#1e1e2e] font-semibold py-1 rounded-md hover:bg-[#cdd6f4] transition cursor-pointer"
				>
					Close
				</button>
			</div>
		</dialog>
	);
}
