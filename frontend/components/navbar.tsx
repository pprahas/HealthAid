
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";

import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

import {
	TwitterIcon,
	GithubIcon,
	DiscordIcon,
	HeartFilledIcon,
	SearchIcon,
} from "@/components/icons";

import { Logo } from "@/components/icons";

export const Navbar = () => {
	return (
		
		<ul className="lg:flex gap-4 ml-auto px-5">
			{siteConfig.navItems.map((item) => (
				<div key={item.href}>
					<NextLink
						className={clsx(
							linkStyles({ color: "foreground", size: "lg" }),
							"data-[active=true]:text-primary data-[active=true]:font-medium"
						)}
						color="foreground"
						href={item.href}
					>
						{item.label}
					</NextLink>
				</div>
			))}
		</ul>

	);
};