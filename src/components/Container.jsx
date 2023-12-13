/* eslint-disable react/prop-types */
const Container = ({ children }) => {
  return (
    <div className="container h-full px-4 mx-auto md:px-8 xl:px-10 max-w-7xl">
      {children}
    </div>
  );
};

export default Container;
