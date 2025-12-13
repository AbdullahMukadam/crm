type FigmaEmbedProps = {
    src: string;
    width?: string | number;
    height?: string | number;
  };
  
  export function FigmaEmbed({
    src,
    width = '100%',
    height = "100%",
  }: FigmaEmbedProps) {
    return (
      <iframe
        style={{ border: 'none' }}
        width={width}
        height={height}
        src={src}
        allowFullScreen
      />
    );
  }
  