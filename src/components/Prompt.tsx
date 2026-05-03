const HOST = window.location.hostname;

type Props = {
    time?: string;
};

export function Prompt({ time }: Props) {
    return (
        <span className="prompt">
            <span className="p-hash"># </span>
            <span className="p-user">guest</span>
            <span className="p-at"> @ </span>
            <span className="p-host">{HOST}</span>
            <span className="p-in"> in </span>
            <span className="p-dir">~</span>
            {time && <span className="p-time"> [{time}]</span>}
            <span className="p-dollar"> $ </span>
        </span>
    );
}
