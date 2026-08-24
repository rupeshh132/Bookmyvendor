export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ivory pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 md:p-12 border border-stone shadow-sm">
        <h1 className="font-display text-4xl text-navy mb-8">Privacy Policy</h1>
        <div className="prose prose-stone max-w-none font-sans text-muted">
          <p>Last updated: August 2026</p>
          <h2 className="text-navy font-display text-2xl mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.</p>
          
          <h2 className="text-navy font-display text-2xl mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We may use the information we collect about you to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide, maintain, and improve our Services;</li>
            <li>Process transactions and send related information;</li>
            <li>Send you technical notices, updates, security alerts, and support messages;</li>
            <li>Respond to your comments, questions, and requests.</li>
          </ul>

          <h2 className="text-navy font-display text-2xl mt-8 mb-4">3. Sharing of Information</h2>
          <p>We do not share your personal information with third parties except as described in this privacy policy (e.g., sharing necessary details with vendors you book through our platform).</p>
        </div>
      </div>
    </div>
  )
}
