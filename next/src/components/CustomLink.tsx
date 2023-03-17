import Link from 'next/link'

interface Props {
  children?: React.ReactNode;
  href: string;
}

function CustomLink({ children, href }: Props) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      {children}
    </Link>
  )
}

export default CustomLink