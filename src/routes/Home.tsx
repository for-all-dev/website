import { Link } from 'react-router-dom'
import heroRaw from '../content/pages/hero.md?raw'
import workRaw from '../content/pages/work.md?raw'
import contactRaw from '../content/pages/contact.md?raw'
import { Markdown } from '../lib/markdown'
import { Section, Qed } from '../components/Proof'
import { posts } from '../lib/posts'
import { staff } from '../lib/staff'
import { clients } from '../lib/clients'
import { ClientLogos } from '../components/ClientLogos'

export function Home() {
  return (
    <>
      <Section id="hero" label="hero">
        <Markdown source={heroRaw} />
      </Section>

      <Qed />

      <Section id="work" label="work">
        <Markdown source={workRaw} />
      </Section>

      {clients.length > 0 && (
        <>
          <Qed />
          <Section id="clients" label="banners">
            <ClientLogos />
          </Section>
        </>
      )}

      {staff.length > 0 && (
        <>
          <Qed />
          <Section id="team" label="team">
            <ul className="team-grid">
              {staff.map((member) => (
                <li key={member.slug} className="team-member">
                  {member.photo && (
                    <img
                      className="team-photo"
                      src={member.photo}
                      alt={member.name}
                      loading="lazy"
                    />
                  )}
                  <p className="team-name">{member.name}</p>
                  {member.role && <p className="team-role">{member.role}</p>}
                  {member.bio && (
                    <div className="team-bio">
                      <Markdown source={member.bio} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        </>
      )}

      <Qed />

      <Section id="contact" label="contact">
        <Markdown source={contactRaw} />
      </Section>

      {posts.length > 0 && (
        <>
          <Qed />
          <Section id="log" label="log">
            <ul className="post-list">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link to={`/p/${post.slug}`}>
                    <span className="post-date">{post.date}</span>
                    <span className="post-title">{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        </>
      )}
    </>
  )
}
