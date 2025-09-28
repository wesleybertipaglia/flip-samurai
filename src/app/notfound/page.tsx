'use client';

import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <section>
      <div className="text-center">
        <p className="fs-1">{`:(`}</p>
        <h2>404 - Page Not Found</h2>
        <p>
          Please go back to <Link to={'/'}>home</Link>
        </p>
      </div>
    </section>
  );
}

export default NotFoundPage;
