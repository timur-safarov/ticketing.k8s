import Link from 'next/link';
import Header from '../components/header';

export default ({ currentUser }) => {

	const links = [
		!currentUser && { label: 'Sign up', href: '/auth/signup' },
		!currentUser && { label: 'Sign in', href: '/auth/signin' },
		currentUser && { label: 'Sign out', href: '/auth/signout' }
	]
	// Отфильтровываем чтобы не было пунктов меню = false
	.filter(linkConfg => linkConfg)
	.map(({ label, href }) => {
		return <li key={href} className="nav-item">
			<Link href={href} className="nav-lnk">{label}</Link>
		</li>
	});

	return (
		<nav className="navbar navbar-light bg-light">

			<Link href="/" className="navbar-brand">GitTix</Link>

			<div className="d-flex justify-content-end">
				<ul className="nav d-flex align-items-center">
					{links}
				</ul>
			</div>

		</nav>
	);

};