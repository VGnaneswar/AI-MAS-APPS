import UploadArea from '../components/UploadArea';
import DocumentTable from '../components/DocumentTable';
import MailboxIntegration from '../components/MailboxIntegration';
import AccessControlPanel from '../components/AccessControlPanel';

export default function Dashboard() {
  return (
    <div>
      <div className="card"><UploadArea /></div>
      <div className="card"><DocumentTable /></div>
      <div className="card"><MailboxIntegration /></div>
      <div className="card"><AccessControlPanel /></div>
    </div>
  );
}
