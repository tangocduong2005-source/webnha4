import Link from "next/link";
import { categories } from "@/data/categories";
import { Sprout, Leaf, Coffee, FlaskConical, ArrowRight } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Sprout: <Sprout className="h-8 w-8" />,
  Leaf: <Leaf className="h-8 w-8" />,
  Coffee: <Coffee className="h-8 w-8" />,
  FlaskConical: <FlaskConical className="h-8 w-8" />,
};

export default function CategorySection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Danh Mục Sản Phẩm
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Khám phá các danh mục dược liệu phong phú, từ cây thuốc tươi đến
            các bài thuốc nam gia truyền
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group"
            >
              <div
                className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 p-6 h-full hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {iconMap[category.icon]}
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {category.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary font-medium">
                    {category.productCount} sản phẩm
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
