type PageContainerProps = {
  children: React.ReactNode;
};
const PageContainer: React.FC<PageContainerProps> = (props:PageContainerProps) => {
  const { children } = props;
  return <div className="min-h-full p-10 bg-black" style={{ width: '100vw' }}>{children}</div>;
};
export default PageContainer;
