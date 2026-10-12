import Link from "next/link";
import { FixtureNote, PageHeader } from "@/components/dashboard/PageHeader";
import { activeOrders, nextSchedule, pendingApproval } from "@/lib/fixtures";

export const metadata = { title: "Beranda" };

export default function HomePage() {
  return (
    <>
      <PageHeader
        title="Beranda"
        subtitle="Tinjau konten dan lanjutkan pesanan."
        action={<Link href="/app/buat" className="btn btn-primary header-cta">+ Buat Konten</Link>}
      />

      <div className="home-grid">
        <section className="area-approval" aria-labelledby="perlu-persetujuan">
          <h2 id="perlu-persetujuan" className="section-title">Perlu persetujuan</h2>
          <div className="card">
            <h3 className="card-title">{pendingApproval.title}</h3>
            <p className="card-text">Rencana versi {pendingApproval.planVersion} menunggu tinjauan.</p>
            <p className="card-text">Periksa naskah, storyboard dan caption.</p>
            <Link href={pendingApproval.action.href} className="btn">Tinjau rencana</Link>
          </div>
        </section>

        <section className="area-orders" aria-labelledby="pesanan-aktif">
          <h2 id="pesanan-aktif" className="section-title">Pesanan aktif</h2>

          <div className="order-cards">
            {activeOrders.map((item) => (
              <div className="card" key={item.id}>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-text">{item.stage}</p>
                <Link href={item.action.href} className="text-link">{item.action.label} →</Link>
              </div>
            ))}
          </div>

          <div className="card order-table">
            <table>
              <thead>
                <tr><th scope="col">Konten</th><th scope="col">Pekerjaan saat ini</th><th scope="col">Tindakan</th></tr>
              </thead>
              <tbody>
                {activeOrders.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.stage}</td>
                    <td><Link href={item.action.href} className="text-link">{item.action.label} →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="area-schedule" aria-labelledby="jadwal-terdekat">
          <h2 id="jadwal-terdekat" className="section-title">Jadwal terdekat</h2>
          <div className="card schedule-card">
            <h3 className="card-title">{nextSchedule.title}</h3>
            <p className="card-text">{nextSchedule.account} · {nextSchedule.platform}</p>
            <p className="card-text">{nextSchedule.date} · {nextSchedule.time}</p>
            <Link href="/app/kalender" className="btn">Lihat jadwal</Link>
          </div>
        </section>
      </div>

      <FixtureNote>Contoh tampilan berisi data fiktif · wireframe</FixtureNote>
    </>
  );
}
