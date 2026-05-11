import Image from "next/image";
import Link from "next/link";

export default function HomeHeader(){
    return <div className="flex justify-between items-center p-4">
        <Image src="/" width={1000} height={50} alt="VISION SQUARE LOGO" />
        <div className="flex items-center gap-4 font-bold">
            <Link href="/about" className="hover:opacity-70 transition">About</Link>
            <Link href="/contact" className="hover:opacity-70 transition">Contact</Link>
            <Link href="/dashboard" className="hover:opacity-70 transition">Dashboard</Link>
            <Link href="/login" className="bg-gray-200 px-4 py-2 rounded-xl">Login</Link>
        </div>
    </div>
}