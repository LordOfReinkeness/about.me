type Props = {
    content: string;
};

export function TxtOutput({ content }: Props) {
    return <pre>{content}</pre>;
}
