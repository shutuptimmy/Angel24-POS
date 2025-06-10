import Navbar from "../../components/Navbar"
import Background from "../../assets/lightBg.png"

interface MainLayoutProps {
    content: React.ReactNode;
}

var LightBg = {
  header: {
      backgroundImage: `url(${Background})`,
      backgroundPosition: 'center top',
      backgroundRepeat: 'repeat-y',
      backgroundSize: 'cover',
      height: `100vh`,

  },
  content: {
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
  }
  

}

const MainLayout = ({content}: MainLayoutProps) => {
  return (
    <>
    <div style={LightBg.header}>
      <div style={LightBg.content}>
        <div className="container-fluid">
            <Navbar />
            <div className="py-4">
                {content}
            </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default MainLayout