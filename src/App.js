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
function App() {
  return (
    <div className="App">
      <Routes>
        {/* Login page */}
        <Route path="/" element={<Login />} />

        {/* Admin Layout (with Header + Sidebar) */}
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} /> {/* /admin */}
          <Route path="my_profile" element={<MyProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="manage-recruiter" element={<ManageUsers />} />
          <Route path="add-employer" element={<AddEmployer />} />
          <Route path="manage-candidates" element={<ManageCandidates />} />
          <Route path="recruiter-list" element={<RecruiterList />} />
          <Route path="company-active-job" element={<CompanyActiveJob />} />
          <Route
            path="employer-subscription"
            element={<EmployerSubscription />}
          />
          <Route path="manage-blog" element={<ManageBlog />} />
          <Route
            path="complete-company-details"
            element={<CompanyCompleteDetails />}
          />
          <Route path="manage-faq" element={<ManageFaq />} />
          <Route path="add-blog" element={<AddBlog />} />
          <Route path="add-faq" element={<AddFaq />} />
          <Route path="super-admin-pack-details" element={<PackDetails />} />
          <Route path="manage-category" element={<ManageCategory />} />
          <Route path="candidate-details" element={<CandinatesDetails />} />
          <Route path="company-details" element={<Companydatails />} />
          <Route path="tech-stack" element={<TechStack />} />
          <Route path="job-type" element={<JobType />} />
          <Route path="salary-range" element={<SalaryRange />} />
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
          <Route
            path="/admin/super-admin-pack-creations-form/:packId?"
            element={<AddPackCreation />}
          />
          <Route
            path="super-admin-plan-subscriber-list"
            element={<PlanSubscriberList />}
          />
          <Route path="industry-sector" element={<IndustrySector />} />
          <Route path="company" element={<Company />} />
          <Route path="seniority-level" element={<SeniorityLevel />} />
          <Route path="home-page-content" element={<HomePageContent />} />
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
          {/* /admin/manage-users */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
