import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
                
                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                    <p className="text-sm text-gray-500 mb-8">Last updated: January 2025</p>
                    
                    <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
                        At <strong>BlogVerse</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains in detail how we collect, use, disclose, store, and safeguard your information when you visit and use our website. By accessing or using BlogVerse, you acknowledge that you have read, understood, and agree to the practices described in this policy.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        We collect information that helps us provide, maintain, and improve our services. The types of information we collect include:
                    </p>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-6 mb-3">1.1 Information You Provide Directly</h3>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li><strong>Comment Information:</strong> When you leave comments on blog posts, we collect your name, email address, website (optional), and the comment content.</li>
                        <li><strong>Contact Information:</strong> If you contact us through our contact form, we collect your name, email address, and any message you send.</li>
                        <li><strong>Account Information:</strong> If you create an account (if applicable), we collect your username, email address, and password (stored securely in encrypted format).</li>
                    </ul>
                    
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-6 mb-3">1.2 Automatically Collected Information</h3>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li><strong>Usage Data:</strong> We automatically collect information about how you interact with our website, including pages visited, time spent on pages, click patterns, and navigation paths.</li>
                        <li><strong>Device Information:</strong> We collect information about your device, including IP address, browser type and version, operating system, device type, and screen resolution.</li>
                        <li><strong>Location Data:</strong> We may collect approximate location information based on your IP address, though this is not precise enough to identify your exact location.</li>
                    </ul>
                    
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-6 mb-3">1.3 Cookies and Tracking Technologies</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        We use cookies, web beacons, and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand user preferences. Cookies are small data files stored on your device that help us remember your preferences and improve site functionality.
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly and cannot be switched off.</li>
                        <li><strong>Analytics Cookies:</strong> These help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
                        <li><strong>Preference Cookies:</strong> These remember your settings and preferences to provide a personalized experience.</li>
                    </ul>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        We use the collected information for various purposes to provide and improve our services:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li><strong>Service Delivery:</strong> To provide, maintain, operate, and improve our blog platform and content delivery.</li>
                        <li><strong>User Experience:</strong> To personalize your experience, remember your preferences, and customize content based on your interests.</li>
                        <li><strong>Communication:</strong> To respond to your comments, questions, and support requests, and to send you important updates about our services.</li>
                        <li><strong>Content Moderation:</strong> To review, moderate, and approve comments to maintain quality and prevent spam or inappropriate content.</li>
                        <li><strong>Analytics and Improvement:</strong> To analyze usage patterns, track trends, understand user behavior, and improve our website&apos;s performance and content.</li>
                        <li><strong>Security:</strong> To detect, prevent, and address security issues, fraudulent activity, and other technical problems.</li>
                        <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, legal processes, and enforce our terms of service.</li>
                    </ul>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">3. Information Sharing and Disclosure</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        We respect your privacy and do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our website, conducting business, or serving users, provided they agree to keep the information confidential.</li>
                        <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or government regulation, or to protect our rights, property, or safety, or that of our users.</li>
                        <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</li>
                        <li><strong>With Your Consent:</strong> We may share your information with your explicit consent or at your direction.</li>
                    </ul>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Security</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        We implement comprehensive security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li><strong>Encryption:</strong> We use industry-standard encryption technologies (SSL/TLS) to protect data transmitted between your browser and our servers.</li>
                        <li><strong>Secure Storage:</strong> Personal information is stored on secure servers with restricted access and monitored security systems.</li>
                        <li><strong>Access Controls:</strong> We limit access to personal information to authorized personnel only, who are required to maintain confidentiality.</li>
                        <li><strong>Regular Updates:</strong> We regularly update our security practices and systems to address emerging threats and vulnerabilities.</li>
                    </ul>
                    <p className="text-gray-700 mb-6 leading-relaxed italic">
                        However, please note that no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">5. Your Privacy Rights</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        Depending on your location, you may have certain rights regarding your personal information:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li><strong>Access:</strong> You have the right to request access to the personal information we hold about you.</li>
                        <li><strong>Correction:</strong> You can request correction of inaccurate or incomplete information.</li>
                        <li><strong>Deletion:</strong> You may request deletion of your personal information, subject to legal obligations we may have to retain certain data.</li>
                        <li><strong>Objection:</strong> You can object to certain processing activities, such as direct marketing.</li>
                        <li><strong>Portability:</strong> You may request a copy of your data in a structured, machine-readable format.</li>
                        <li><strong>Withdrawal of Consent:</strong> If processing is based on consent, you can withdraw your consent at any time.</li>
                    </ul>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        To exercise these rights, please contact us through our <Link href="/contact" className="text-blue-600 hover:text-blue-700 underline">Contact Us</Link> page. We will respond to your request within a reasonable timeframe and in accordance with applicable laws.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">6. Third-Party Links and Services</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        Our website may contain links to third-party websites, services, or advertisements. These third-party sites have their own privacy policies, which we encourage you to review. We are not responsible for the privacy practices or content of these external sites.
                    </p>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        We may also use third-party services for analytics, advertising, and other purposes. These services may collect information about your online activities across different websites and services. We recommend reviewing their privacy policies to understand how they collect and use information.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">7. Children&apos;s Privacy</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        BlogVerse is not intended for children under the age of 13 (or the applicable age of consent in your jurisdiction). We do not knowingly collect personal information from children. If we become aware that we have collected information from a child without parental consent, we will take steps to delete that information promptly. If you believe we have collected information from a child, please contact us immediately.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">8. International Data Transfers</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. By using our services, you consent to the transfer of your information to these countries. We take appropriate safeguards to ensure your information receives an adequate level of protection.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">9. Data Retention</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it. Comment data may be retained indefinitely unless you request deletion, as comments are part of the public content of blog posts.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">10. Changes to This Privacy Policy</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li>Posting the updated Privacy Policy on this page with a new &quot;Last updated&quot; date</li>
                        <li>Providing notice through our website or other communication channels if changes are significant</li>
                    </ul>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information. Your continued use of our website after changes are posted constitutes your acceptance of the updated policy.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">11. Contact Us</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us through our <Link href="/contact" className="text-blue-600 hover:text-blue-700 underline">Contact Us</Link> page. We are committed to addressing your concerns and will respond as promptly as possible.
                    </p>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        For privacy-related inquiries, you can also reach out to us by email or through the contact information provided on our website. We take privacy seriously and will work with you to resolve any issues or answer any questions you may have.
                    </p>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}

