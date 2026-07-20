import Footer from './Footer.jsx';
import Header from './Header.jsx';

export default function PageShell({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
