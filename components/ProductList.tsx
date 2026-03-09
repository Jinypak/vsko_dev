import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const ProductList = () => {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-2">
        <NavigationMenuItem>
          <NavigationMenuLink href="/about" className="font-medium">
            회사 소개
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-medium">제품 소개</NavigationMenuTrigger>
          <NavigationMenuContent className="min-w-[240px] p-2">
            <NavigationMenuLink
              href="/product"
              className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100"
            >
              제품 개요
            </NavigationMenuLink>
            <NavigationMenuLink
              href="/product/hsm"
              className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100"
            >
              Thales Luna HSM
            </NavigationMenuLink>
            <NavigationMenuLink
              href="/product/pse"
              className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100"
            >
              Thales PSE
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/contact" className="font-medium">
            문의하기
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default ProductList;
