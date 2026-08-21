import { Link, Navigate, useParams } from 'react-router-dom'
import { Markdown } from '../lib/markdown'
import { getPost } from '../lib/posts'

export function Post() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined

  if (!post) return <Navigate to="/404" replace />

  return (
    <article className="theorem">
      <Link to="/" className="back-link">
        ← index
      </Link>
      <p className="theorem-head">
        theorem <span className="slug">log.{post.slug}</span>
      </p>
      <p className="theorem-date">dated {post.date}</p>
      <p className="theorem-title">{post.title}</p>
      <hr />
      <p className="proof-label">proof.</p>
      <div className="proof-body">
        <Markdown source={post.content} />
      </div>
      <p className="qed-mark theorem-qed" aria-hidden="true">
        ∎
      </p>
    </article>
  )
}
