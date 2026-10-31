const { test, expect } = require('@playwright/test');

test('GET a post', async ({ request }) => {
    const response = await request.get('/posts/1');

    // 200 = OK
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body.userId).toBe(1);
    expect(body.title).toBe('sunt aut facere repellat provident occaecati excepturi optio reprehenderit');
    expect(body.body).toBe('quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto');
});

test('POST a post', async ({ request }) => {
    const response = await request.post('/posts', {
        data: {
            title: 'foo',
            body: 'bar',
            userId: 1
        }
    });
    // 201 = Created
    expect(response.status()).toBe(201);

    const body = await response.json();
    // Check that the response body contains the expected data
    expect(body).toMatchObject({
        title: 'foo',
        body: 'bar',
        userId: 1
    });
    // Check that the response body contains an id property
    expect(body.id).toBeDefined();
});

test('PUT: Verify a post can be updated', async ({ request }) => {
    const response = await request.put('/posts/1', {
        data: {
            id: 1,
            title: 'Updated',
            body: 'New body',
            userId: 1
        }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
        id: 1,
        title: 'Updated',
        body: 'New body',
        userId: 1
    });
});

test('DELETE: Verify a post can be deleted', async ({ request }) => {
    const response = await request.delete('/posts/1');
    expect(response.status()).toBe(200);
});

test('GET: Verify a post that does not exist returns 404', async ({ request }) => {
    const response = await request.get('/posts/9999');
    expect(response.status()).toBe(404);
});

test('GET: Verify list of 100 posts', async ({ request }) => {
    const response = await request.get('/posts');
    expect(response.ok()).toBeTruthy();
    const posts = await response.json();
    expect(posts).toHaveLength(100);
});

// Simplified
test('GET: Verify every post has the expected fields', async ({ request }) => {
    const posts = await (await request.get('/posts')).json();
    for (const post of posts) {
        expect(post).toHaveProperty('id');
        expect(post).toHaveProperty('title');
        expect(typeof post.userId).toBe('number');
    }
});

// Cleaner version and easy to understand
test('GET: Verify every post has the expected fields (All)', async ({ request }) => {
    const response = await request.get('/posts');
    expect(response.status()).toBe(200);

    const posts = await response.json();
    expect(posts).toHaveLength(100);

    for (const post of posts) {
        expect.soft(post, `post ${post.id}`).toMatchObject({
            id: expect.any(Number),
            userId: expect.any(Number),
            title: expect.any(String),
            body: expect.any(String),
        });
    }
});