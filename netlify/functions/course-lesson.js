const { json, authenticatedUser, hasCourseAccess, supabase } = require('./_course');

const ALLOWED_LESSONS = new Set(['m2-going-places', 'm4-day-in-life', 'm8-para-vs-por', 'm12-subjunctive', 'm16-poetry-song-culture']);

exports.handler = async (event) => {
  try {
    const user = await authenticatedUser(event);
    const slug = event.queryStringParameters?.slug;
    if (!user) return json(401, { error: 'Sign in required.' });
    if (!ALLOWED_LESSONS.has(slug)) return json(404, { error: 'Lesson not found.' });
    if (!await hasCourseAccess(user.id)) return json(403, { error: 'Paid course access required.' });
    const response = await supabase(`/storage/v1/object/course-modules/${encodeURIComponent(slug)}.html`);
    if (!response.ok) return json(404, { error: 'This lesson has not been published yet.' });
    return { statusCode: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store' }, body: await response.text() };
  } catch (error) {
    console.error('[course-lesson]', error);
    return json(500, { error: 'Unable to load lesson.' });
  }
};
