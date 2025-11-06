import { Link } from 'react-router'
import { usePuterStore } from '~/lib/puter'

const Navbar = () => {
  const { auth } = usePuterStore()
  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">ResuScan</p>
      </Link>
      <div className="flex flex-row gap-5 items-center justify-center">
        <Link to="/upload" className="primary-button w-fit">
          Upload Resume
        </Link>
        <button
          className="w-[42px] h-[42px] cursor-pointer"
          title="Logout"
          aria-label="Logout button"
          onClick={auth.signOut}
        >
          <img src="/icons/logout.svg" />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
