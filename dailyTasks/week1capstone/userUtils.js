
// ─────────────────────────────────────────
// FILE 2: userUtils.js
// ─────────────────────────────────────────
// Import constants from constants.js
// Export these named utility functions:

// 1. formatUser(user)
//    - Input: { firstName, lastName, age, role, bio }
//    - Use optional chaining + nullish coalescing
//    - Return: {
//        fullName: "Alice Johnson",
//        isAdult: true,
//        role: role ?? "viewer",
//        bio: bio ?? "No bio added",
//        avatar: DEFAULT_AVATAR
//      }

// 2. filterByRole(users, role)
//    - Return users matching role
//    - If no role given → return all users

// 3. getUserStats(users)
//    - Use reduce to return:
//      { total, admins, editors, viewers, averageAge }

// 4. searchUsers(users, query)
//    - Search by name OR role (case insensitive)
//    - Use filter + optional chaining

// ─────────────────────────────────────────

import { ROLES, DEFAULT_AVATAR } from './constants.js';

export function formatUser(user) {
    const { firstName, lastName, age, role, bio } = user;

    const fullName = `${firstName} ${lastName}`;

    const isAdult = age >= 18;

    const safeRole = role ?? "viewer";

    const validatedRole = ROLES.includes(safeRole) ? safeRole : "viewer";

    const safeBio = bio ?? "No bio added";

    return {
        fullName,
        isAdult,
        role: validatedRole,
        bio: safeBio,
        avatar: DEFAULT_AVATAR,
    };

}

export function filterByRole(users, role) {
    if (!role) return users;

    return users.filter(user =>
        user?.role?.toLowerCase() === role.toLowerCase()
    );
}

export function getUserStats(users) {
    const stats = users.reduce((acc, user) => {
        const role = user?.role ?? "viewer";

        acc.total += 1;

        if (role === "admin") acc.admins += 1;
        else if (role === "editor") acc.editors += 1;
        else acc.viewers += 1;

        acc.totalAge += user?.age ?? 0;

        return acc;
    }, {
        total: 0,
        admins: 0,
        editors: 0,
        viewers: 0,
        totalAge: 0,
    });

    const averageAge = stats.total > 0
        ? Math.round(stats.totalAge / stats.total)
        : 0;

    const { totalAge, ...finalStats } = stats;

    return { ...finalStats, averageAge };
}

export function searchUsers(users, query) {

    if (!query) return users;

    const normalizedQuery = query.toLowerCase().trim();

    return users.filter(user => {

        const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.toLowerCase();

        const role = user?.role?.toLowerCase() ?? '';

        return fullName.includes(normalizedQuery) ||
            role.includes(normalizedQuery);
    });

}





