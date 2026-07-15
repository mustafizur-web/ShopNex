import { useParams } from 'react-router-dom';

const pagesData: Record<string, { title: string, content: string }> = {
  'faq': {
    title: 'Frequently Asked Questions',
    content: `
      ### How long does delivery take?
      Delivery typically takes 3-5 business days for domestic orders. International shipping can take 7-14 business days.
      
      ### What is your return policy?
      We offer a 30-day hassle-free return policy. If you are not completely satisfied, you can return your item in its original condition.
      
      ### Do you ship internationally?
      Yes, we ship to most countries worldwide. Shipping costs are calculated at checkout.
    `
  },
  'return-policy': {
    title: 'Return Policy',
    content: `
      At ShopNex, we want you to be perfectly satisfied with your purchase. 
      If you are not satisfied, you may return the item within 30 days of receipt.
      
      Items must be unworn, unwashed, and have original tags attached.
      Refunds will be processed to the original form of payment within 7-10 business days after we receive your return.
    `
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    content: `
      Your privacy is important to us. This privacy policy explains how ShopNex collects, uses, and protects your personal information.
      
      We collect information you provide directly to us, such as when you create an account, make a purchase, or contact customer support.
      We use this information to fulfill your orders, communicate with you, and improve our services.
      
      We do not sell your personal information to third parties.
    `
  },
  'terms': {
    title: 'Terms & Conditions',
    content: `
      By accessing and using the ShopNex website, you agree to comply with and be bound by these terms and conditions.
      
      All content on this site, including text, graphics, logos, and images, is the property of ShopNex and protected by intellectual property laws.
      
      We reserve the right to modify these terms at any time without prior notice.
    `
  }
};

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  const page = pagesData[slug || ''] || { title: 'Page Not Found', content: 'The content you are looking for does not exist.' };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 mt-12 min-h-screen">
      <div className="glass-panel p-8 md:p-16 rounded-3xl border border-primary-fixed/20 shadow-2xl relative overflow-hidden">
         {/* Glow Behind Details */}
         <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary-fixed/5 rounded-full blur-[80px] pointer-events-none -mr-20 -mt-20"></div>
         
         <h1 className="font-sans font-extrabold text-3xl md:text-5xl text-on-surface mb-10 tracking-tight relative z-10 border-b border-primary-fixed/20 pb-6">
            {page.title}
         </h1>
         
         <div className="prose prose-invert prose-p:text-on-surface-variant prose-headings:text-on-surface prose-a:text-primary-fixed relative z-10 font-sans leading-relaxed">
            {page.content.split('\n').map((paragraph, index) => {
               if (paragraph.trim().startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-bold mt-8 mb-3 tracking-wide">{paragraph.replace('### ', '')}</h3>
               }
               return paragraph.trim() ? <p key={index} className="mb-4">{paragraph}</p> : null;
            })}
         </div>
      </div>
    </div>
  );
}
