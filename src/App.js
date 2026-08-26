import "./App.css";
import Dashboard from "./components/dashboard/DashboardContent";
import Login from "./pages/Login";
import AdminLayout from "../src/components/dashboard/AdminLayout";
import { Routes, Route } from "react-router-dom";
import MyProfile from "./pages/MyProfile";
import ManageUsers from "./pages/ManageEmployer";
import ManageCandidates from "./pages/ManageCandidates";
import ManageCategory from "./pages/ManageCategory";
import ChangePassword from "./pages/ChangePassword";
import MainLayout from "./components/layout/MainLayout";
import EmployerFAQ from "./pages/CmsPages/EmployerFAQ";
import EmployeeFAQ from "./pages/CmsPages/JobSeekerFAQ";
import AddEmployer from "./pages/AddEmployer";
import CandinatesDetails from "./pages/CandinatesDetails";
import TechStack from "./pages/TechStack";
import JobType from "./pages/JobType";
import SalaryRange from "./pages/SalaryRange";
import IndustrySector from "./pages/IndustrySector";
import Company from "./pages/Company";
import SeniorityLevel from "./pages/SeniorityLevel";
import Companydatails from "./pages/Companydatails";
import HomePageContent from "./pages/CmsPages/HomePageContent";
import AboutContent from "./pages/CmsPages/AboutContent";
import ArticlePageContent from "./pages/CmsPages/ArticlePageContent";
import ContactPageContent from "./pages/CmsPages/ContactPageContent";
import FooterPageContent from "./pages/CmsPages/FooterPageContent";
import TermandCondition from "./pages/CmsPages/TermandCondition";
import PrivacyAndPolicy from "./pages/CmsPages/PrivacyAndPolicy";
import PaymentGatewayManagement from "./pages/PaymentGatewayManagement";
import PaymentGatewaySetupForm from "./pages/PaymentGatewaySetupForm";
import PricePlanForm from "./pages/PricePlanForm";
import PricingPlanManagement from "./pages/PricingPlanManagement";
import ManageBlog from "./pages/ManageBlog";
import ManageFaq from "./pages/ManageFaq";
import AddBlog from "./pages/AddBlog";
import AddFaq from "./pages/AddFaq";
import PackCreationList from "./pages/PackCreationList";
import AddPackCreation from "./pages/AddPackCreation";
import PlanSubscriberList from "./pages/PlanSubscriberList";
import PackDetails from "./pages/PackDetails";
import AddPaymentGateway from "./pages/AddPaymentGateway";
import FeaturedJob from "./pages/jobPromotion/FeaturedJob";
import HighlightedJob from "./pages/jobPromotion/HighlightedJob";
import HomeVisibility from "./pages/jobPromotion/HomeVisibility";
import JobPromotions from "./pages/JobPromotions";
import RecruiterList from "./pages/RecruiterList";
import CompanyActiveJob from "./pages/CompanyActiveJob";
import UserWallet from "./pages/UserWallet";
import EmployerSubscription from "./pages/EmployerSubscription";
import CompanyCompleteDetails from "./pages/CompanyCompleteDetails";
import AddOnPackCreatedList from "./pages/AddOnPackCreatedList";
import AddOnPackDetails from "./pages/AddOnPackDetails";
import AdOnPackCreateForm from "./pages/AdOnPackCreateForm";
import ManageSkillCategory from "./pages/ManageSkillCategory";
import ManageQuestionBank from "./pages/ManageQuestionBank";
import AddQuestion from "./pages/AddQuestion";
import ManageAssementList from "./pages/ManageAssementList";
import CreateAssement from "./pages/CreateAssement";
import ForgotPassword from "./pages/ForgotPassword";
import ViewAssement from "./pages/ViewAssement";
import UpdateBlog from "./pages/UpdateBlog";
import ViewInvoice from "./pages/ViewInvoice";
import AdminCreditManagement from "./pages/AdminCreditManagement";
import InvoiceManagement from "./pages/InvoiceManagement";
import NotificationsList from "./pages/NotificationsList";
import CreateNotification from "./pages/CreateNotification";
import PurchaseHistory from "./pages/PurchaseHistory";
import EditInvoice from "./pages/EditInvoice";
import AllInvoiceList from "./pages/AllInvoiceList";
import NotificationGovernance from "./pages/NotificationGovernance";
import ContactMessage from "./pages/ContactMessage";
import EmployeerHomeContent from "./pages/CmsPages/EmployeerHomeContent";
import AdminAISettings from "./pages/AdminAISettings";
import AdminCurrencySettings from "./pages/AdminCurrencySettings";
import AdminSecurity from "./pages/AdminSecurity";
import AdminAuthProviderSettings from "./pages/AdminAuthProviderSettings";
import AdminServiceSettings from "./pages/AdminServiceSettings";
import AdminGoogleMarketingSettings from "./pages/AdminGoogleMarketingSettings";
import AdminHomePageSeoSettings from "./pages/AdminHomePageSeoSettings";
import AdminJobsListingSeoSettings from "./pages/AdminJobsListingSeoSettings";
import AdminGlobalSeoSettings from "./pages/AdminGlobalSeoSettings";
import AdminCloudStorageSettings from "./pages/AdminCloudStorageSettings";
import Remote from "./pages/Remote";
import SearchQuotes from "./pages/SearchQuotes";
import AuditLogs from "./pages/AuditLogs";
import VisitorConversionAnalytics from "./pages/VisitorConversionAnalytics";
import OfferPerformanceAnalytics from "./pages/OfferPerformanceAnalytics";
import ManageTickets from "./pages/ManageTickets";
import SystemMonitoring from "./pages/SystemMonitoring";
import ManageJobs from "./pages/ManageJobs";
import JobReports from "./pages/JobReports";
function App() {
  return (
    <div className="App">
      <Routes>
        {/* Login page */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin Layout (with Header + Sidebar) */}
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} /> {/* /admin */}
          <Route path="my_profile" element={<MyProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="manage-recruiter" element={<ManageUsers />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="jobs" element={<ManageJobs />} />
          <Route path="job-moderation" element={<ManageJobs />} />
          <Route path="job-reports" element={<JobReports />} />
          <Route path="moderation/job-reports" element={<JobReports />} />
          <Route path="manage-reports" element={<JobReports />} />
          <Route path="add-employer" element={<AddEmployer />} />
          <Route path="notification-template" element={<NotificationsList />} />
          <Route
            path="notification-governance"
            element={<NotificationGovernance />}
          />
          <Route
            path="create-notification/:id"
            element={<CreateNotification />}
          />{" "}
          <Route path="manage-candidates" element={<ManageCandidates />} />
          <Route path="recruiter-list" element={<RecruiterList />} />
          <Route path="company-active-job" element={<CompanyActiveJob />} />
          <Route path="ai-settings" element={<AdminAISettings />} />{" "}
          <Route path="currency-settings" element={<AdminCurrencySettings />} />{" "}
          <Route path="security-dashboard" element={<AdminSecurity />} />
          <Route
            path="oauth-settings"
            element={<AdminAuthProviderSettings />}
          />
          <Route
            path="service-settings"
            element={<AdminServiceSettings />}
          />
          <Route
            path="google-marketing-settings"
            element={<AdminGoogleMarketingSettings />}
          />
          <Route
            path="cloud-storage-settings"
            element={<AdminCloudStorageSettings />}
          />
          <Route
            path="global-seo-settings"
            element={<AdminGlobalSeoSettings />}
          />
          <Route
            path="seo-global-settings"
            element={<AdminGlobalSeoSettings />}
          />
          <Route
            path="home-page-seo-settings"
            element={<AdminHomePageSeoSettings />}
          />
          <Route
            path="jobs-listing-seo-settings"
            element={<AdminJobsListingSeoSettings />}
          />
          <Route
            path="employer-subscription"
            element={<EmployerSubscription />}
          />
          <Route
            path="complete-company-details"
            element={<CompanyCompleteDetails />}
          />
          <Route
            path="company-purchase-history"
            element={<PurchaseHistory />}
          />
          <Route path="manage-blog" element={<ManageBlog />} />credit-management
          <Route path="contact-messages" element={<ContactMessage />} />
          <Route path="manage-faq" element={<ManageFaq />} />
          <Route path="all-invoice-list" element={<InvoiceManagement />} />
          <Route path="invoice-list" element={<AllInvoiceList />} />
          <Route path="add-blog" element={<AddBlog />} />
          <Route path="update-blog/:id" element={<UpdateBlog />} />
          <Route path="add-faq" element={<AddFaq />} />
          <Route path="super-admin-pack-details" element={<PackDetails />} />
          <Route path="manage-category" element={<ManageCategory />} />
          <Route path="candidate-details" element={<CandinatesDetails />} />
          <Route path="company-details" element={<Companydatails />} />
          <Route path="tech-stack" element={<TechStack />} />
          <Route path="employment-type" element={<JobType />} />
          <Route path="remote" element={<Remote />} />
          <Route path="salary-range" element={<SalaryRange />} />
          <Route path="search-quotes" element={<SearchQuotes />} />
          <Route
            path="manage-skill-categories"
            element={<ManageSkillCategory />}
          />
          <Route path="/admin/edit-invoice/:id" element={<EditInvoice />} />
          <Route path="manage-question-bank" element={<ManageQuestionBank />} />
          <Route path="assessment-list" element={<ManageAssementList />} />
          <Route path="create-assessment" element={<CreateAssement />} />
          <Route path="view-assessment" element={<ViewAssement />} />
          <Route path="add-question" element={<AddQuestion />} />
          <Route
            path="super-admin-pack-creations"
            element={<PackCreationList />}
          />
          <Route
            path="super-admin-add-on-pack-created-list"
            element={<AddOnPackCreatedList />}
          />
          <Route
            path="super-admin-add-on-pack-create-form"
            element={<AdOnPackCreateForm />}
          />
          <Route
            path="super-admin-add-on-pack-details"
            element={<AddOnPackDetails />}
          />
          <Route
            path="super-admin-pack-creations-form"
            element={<AddPackCreation />}
          />
          <Route path="view-invoice/:invoiceId" element={<ViewInvoice />} />{" "}
          <Route
            path="/admin/super-admin-pack-creations-form/:packId?"
            element={<AddPackCreation />}
          />
          <Route
            path="super-admin-plan-subscriber-list"
            element={<PlanSubscriberList />}
          />
          <Route path="industry-sector" element={<IndustrySector />} />
          <Route path="credit-management" element={<AdminCreditManagement />} />
          <Route path="company" element={<Company />} />
          <Route path="seniority-level" element={<SeniorityLevel />} />
          <Route path="home-page-content" element={<HomePageContent />} />
          <Route
            path="employer-home-page-content"
            element={<EmployeerHomeContent />}
          />
          <Route path="employer_faq" element={<EmployerFAQ />} />
          <Route path="jobSeeker_faq" element={<EmployeeFAQ />} />
          <Route path="about-page-content" element={<AboutContent />} />
          <Route path="article-page-content" element={<ArticlePageContent />} />
          <Route path="contact-page-content" element={<ContactPageContent />} />
          <Route path="footer-page-content" element={<FooterPageContent />} />
          <Route path="term-condition-content" element={<TermandCondition />} />
          <Route path="privacy-policy-content" element={<PrivacyAndPolicy />} />
          <Route
            path="payment-gateway-management"
            element={<PaymentGatewayManagement />}
          />
          <Route path="add-gateway-setup" element={<AddPaymentGateway />} />
          <Route
            path="payment-gateway-setup-form"
            element={<PaymentGatewaySetupForm />}
          />
          <Route path="price-plan-form" element={<PricePlanForm />} />
          <Route
            path="pricing-plan-management"
            element={<PricingPlanManagement />}
          />
          <Route path="user-wallet" element={<UserWallet />} />
          <Route path="featured-job" element={<FeaturedJob />} />
          <Route path="highlighted-job" element={<HighlightedJob />} />
          <Route path="home-visibility" element={<HomeVisibility />} />
          <Route path="job-promotions" element={<JobPromotions />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="log-data" element={<AuditLogs />} />
          <Route
            path="analytics/visitor-conversion"
            element={<VisitorConversionAnalytics />}
          />
          <Route
            path="visitor-conversion-analytics"
            element={<VisitorConversionAnalytics />}
          />
          <Route
            path="analytics/offer-performance"
            element={<OfferPerformanceAnalytics />}
          />
          <Route
            path="offer-performance-analytics"
            element={<OfferPerformanceAnalytics />}
          />
          <Route path="manage-tickets" element={<ManageTickets />} />
          <Route path="tickets" element={<ManageTickets />} />
          <Route path="system-monitoring" element={<SystemMonitoring />} />
          <Route path="system-status" element={<SystemMonitoring />} />
          {/* /admin/manage-users */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
