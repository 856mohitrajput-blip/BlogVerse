import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
                
                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                    <p className="text-sm text-gray-500 mb-8">Last updated: January 2025</p>
                    
                    <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
                        Welcome to <strong>BlogVerse</strong>. These Terms of Service (&quot;Terms&quot;, &quot;Agreement&quot;) constitute a legally binding agreement between you and BlogVerse regarding your use of our website, services, and content. Please read these Terms carefully before accessing or using our platform. By accessing, browsing, or using BlogVerse, you acknowledge that you have read, understood, and agree to be bound by these Terms and all applicable laws and regulations.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        By accessing or using BlogVerse, you accept and agree to be bound by these Terms of Service, our Privacy Policy, and all applicable laws and regulations. If you do not agree with any part of these Terms, you must not access or use our website.
                    </p>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        These Terms apply to all visitors, users, and others who access or use the service. You represent that you are at least 13 years of age (or the age of majority in your jurisdiction) and have the legal capacity to enter into this Agreement.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        BlogVerse is a blog publishing platform that provides users with access to articles, content, and related services. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time, with or without notice, and we shall not be liable to you or any third party for any such modification, suspension, or discontinuance.
                    </p>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        We may also impose limits on certain features or restrict your access to parts or all of the service without notice or liability. We do not guarantee that the service will be available at all times or that it will be free from errors, viruses, or other harmful components.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">3. Use License</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        Subject to your compliance with these Terms, BlogVerse grants you a limited, non-exclusive, non-transferable, revocable license to access and use our website for personal, non-commercial purposes. This license does not include:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li>The right to modify, copy, reproduce, or create derivative works from our content</li>
                        <li>Commercial use of our content, trademarks, or intellectual property</li>
                        <li>The right to remove copyright, trademark, or other proprietary notices</li>
                        <li>Attempts to decompile, reverse engineer, or disassemble any software or code</li>
                        <li>Resale or redistribution of our content without express written permission</li>
                        <li>Use of automated systems or scripts to scrape, crawl, or harvest content</li>
                    </ul>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        This license shall automatically terminate if you violate any of these restrictions and may be terminated by BlogVerse at any time. Upon termination, you must destroy any downloaded materials in your possession, whether in electronic or printed format.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">4. User Accounts and Registration</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        Some features of BlogVerse may require you to create an account. When creating an account, you agree to:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li>Provide accurate, current, and complete information</li>
                        <li>Maintain and promptly update your account information</li>
                        <li>Maintain the security of your password and account</li>
                        <li>Accept responsibility for all activities that occur under your account</li>
                        <li>Notify us immediately of any unauthorized use of your account</li>
                    </ul>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        You are responsible for maintaining the confidentiality of your account credentials. BlogVerse is not liable for any loss or damage arising from your failure to protect your account information.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">5. User Conduct and Responsibilities</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        You agree to use BlogVerse only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of the service. You agree <strong>not</strong> to:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li>Violate any applicable local, state, national, or international laws or regulations</li>
                        <li>Infringe upon the intellectual property rights, privacy rights, or other rights of any third party</li>
                        <li>Transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of another&apos;s privacy</li>
                        <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with any person or entity</li>
                        <li>Transmit viruses, malware, or any other malicious code or harmful technology</li>
                        <li>Interfere with or disrupt the service, servers, or networks connected to the service</li>
                        <li>Attempt to gain unauthorized access to any portion of the service or any other systems or networks</li>
                        <li>Use automated means (including bots, scrapers, and spiders) to access the service or collect information</li>
                        <li>Engage in any form of spam, unsolicited commercial communications, or bulk messaging</li>
                        <li>Collect or store personal data about other users without their express consent</li>
                        <li>Use the service for any commercial purpose without our express written consent</li>
                    </ul>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">6. User-Generated Content</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        BlogVerse may allow you to post comments, feedback, or other content (&quot;User Content&quot;). By posting User Content, you grant BlogVerse a worldwide, non-exclusive, royalty-free, perpetual, irrevocable, and sublicensable license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content.
                    </p>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        You represent and warrant that:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li>You own or have the necessary rights to post the User Content</li>
                        <li>The User Content does not violate any third-party rights, including intellectual property, privacy, or publicity rights</li>
                        <li>The User Content is accurate and not misleading</li>
                        <li>The User Content complies with all applicable laws and these Terms</li>
                    </ul>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        We reserve the right to review, edit, remove, or refuse to post any User Content at our sole discretion, without prior notice. We are not obligated to monitor User Content but may do so to ensure compliance with these Terms.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">7. Intellectual Property Rights</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        All content on BlogVerse, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and software, is the property of BlogVerse or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
                    </p>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        The BlogVerse name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of BlogVerse or its affiliates. You must not use such marks without our prior written permission. All other trademarks, service marks, and trade names are the property of their respective owners.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">8. Content Disclaimer and Accuracy</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        The materials and information on BlogVerse are provided on an <em>&quot;as is&quot;</em> and <em>&quot;as available&quot;</em> basis. While we strive to provide accurate and up-to-date information, we make no warranties, expressed or implied, regarding:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li>The accuracy, completeness, reliability, or timeliness of the content</li>
                        <li>The suitability of the content for any particular purpose</li>
                        <li>That the service will be uninterrupted, secure, or error-free</li>
                        <li>That defects will be corrected or that the service is free of viruses or other harmful components</li>
                    </ul>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        Blog content reflects the opinions and views of the authors and does not necessarily represent the views of BlogVerse. We are not responsible for any errors or omissions in the content or for any actions taken based on the information provided.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        To the fullest extent permitted by applicable law, BlogVerse and its officers, directors, employees, agents, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li>Loss of profits, revenue, data, or use</li>
                        <li>Business interruption</li>
                        <li>Personal injury or property damage</li>
                        <li>Losses resulting from unauthorized access or use of the service</li>
                    </ul>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        In no event shall BlogVerse&apos;s total liability to you for all damages exceed the amount you paid to us, if any, or $100, whichever is greater. Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">10. Indemnification</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        You agree to indemnify, defend, and hold harmless BlogVerse and its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including attorney&apos;s fees) arising from: (a) your use of or access to the service; (b) your violation of these Terms; (c) your violation of any third-party right, including intellectual property, privacy, or other rights; (d) any User Content you post; or (e) any other activity related to your account.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">11. Third-Party Links and Services</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        BlogVerse may contain links to third-party websites, services, or resources that are not owned or controlled by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. You acknowledge and agree that BlogVerse shall not be responsible or liable for any damage or loss caused by or in connection with the use of any such content, goods, or services available on or through any such third-party sites or services.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">12. Termination</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        We reserve the right, at our sole discretion, to terminate or suspend your access to all or any part of the service, with or without cause or notice, for any reason, including breach of these Terms. Upon termination:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li>Your right to access and use the service will immediately cease</li>
                        <li>All licenses and rights granted to you under these Terms will terminate</li>
                        <li>We may delete your account and all associated data</li>
                    </ul>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">13. Changes to Terms</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        We reserve the right to modify, update, or revise these Terms at any time. When we make changes, we will:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li>Update the &quot;Last updated&quot; date at the top of this page</li>
                        <li>Post the revised Terms on this page</li>
                        <li>Provide notice of material changes through the service or via email if applicable</li>
                    </ul>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        Your continued use of the service after any changes constitutes your acceptance of the new Terms. If you do not agree to the revised Terms, you must stop using the service.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">14. Governing Law and Dispute Resolution</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which BlogVerse operates, without regard to its conflict of law provisions. Any disputes arising from or relating to these Terms or your use of the service shall be resolved through:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
                        <li><strong>Good Faith Negotiation:</strong> Parties agree to first attempt to resolve disputes through direct communication</li>
                        <li><strong>Mediation:</strong> If negotiation fails, disputes may be submitted to mediation before a mutually agreed mediator</li>
                        <li><strong>Jurisdiction:</strong> Any legal action or proceeding shall be brought exclusively in the courts of the applicable jurisdiction</li>
                    </ul>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">15. Severability</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">16. Entire Agreement</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        These Terms, together with our Privacy Policy, constitute the entire agreement between you and BlogVerse regarding the use of the service and supersede all prior agreements, understandings, or communications, whether written or oral.
                    </p>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">17. Contact Information</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        If you have any questions, concerns, or requests regarding these Terms of Service, please contact us through our <Link href="/contact" className="text-blue-600 hover:text-blue-700 underline">Contact Us</Link> page. We will make every effort to respond to your inquiries in a timely manner.
                    </p>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        By using BlogVerse, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. Thank you for being part of our community.
                    </p>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}

