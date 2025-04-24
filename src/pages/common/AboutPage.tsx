
import { Layout } from "@/components/layout/Layout";

export default function AboutPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">About City Road Management Service</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg mb-6">
            The City Road Management Service is dedicated to maintaining and improving our city's infrastructure through efficient road maintenance and repair services.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="p-6 bg-card rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p>To provide efficient and responsive road maintenance services that ensure safe and comfortable transportation for all citizens.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
              <p>To create a city with exemplary infrastructure that enhances the quality of life for all residents.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
