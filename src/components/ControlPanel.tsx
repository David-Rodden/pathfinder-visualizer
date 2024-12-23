const ControlPanel: React.FC<{ onReset: () => void }> = ({ onReset }) => (
    <div className="flex justify-center gap-4 mt-4">
        <button className="btn" onClick={onReset}>Reset</button>
        <button className="btn">Start</button>
    </div>
);

export default ControlPanel;
