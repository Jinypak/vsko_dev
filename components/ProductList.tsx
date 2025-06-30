import {
  NavigationMenu,
  NavigationMenuContent,
  //   NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  //   NavigationMenuViewport,
} from '@/components/ui/navigation-menu';

const ProductList = () => {
  return (
    <NavigationMenu className="hidden md:flex gap-4">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/about">회사 소개</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>제품 소개</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/product/hsm" className="">
              Thales Luna
            </NavigationMenuLink>
            <NavigationMenuLink href="/product/pse">
              Thales PSE
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/contact">Contact</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default ProductList;
