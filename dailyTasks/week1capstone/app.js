
// FILE 3: app.js
// ─────────────────────────────────────────
// Import everything and test with this data:

import { formatUser, filterByRole, getUserStats, searchUsers } from "./userUtils.js";

import { ROLES } from "./constants.js";

const users = [
    { firstName: "Alice", lastName: "Johnson", age: 28, role: "admin", bio: "Full stack dev" },
    { firstName: "Bob", lastName: "Smith", age: 22, role: "viewer", bio: null },
    { firstName: "Carol", lastName: "White", age: 35, role: "editor", bio: undefined },
    { firstName: "Dave", lastName: "Brown", age: 17, role: null, bio: "Student" },
    { firstName: "Eve", lastName: "Davis", age: 31, role: "admin", bio: "Designer" },
];

// Test all 4 functions and log results cleanly

const section = (title) => {
    console.log("\n" + "=".repeat(50));
    console.log(` ${title}`);
    console.log("=".repeat(50));
};

section("TEST 1: formatUser()- format each user");

const formattedUsers = users.map(user => formatUser(user));


formattedUsers.forEach((user, index) => {
    console.log(`\nUser ${index + 1}:`);
    console.log(` Full Name: ${user.fullName}`);
    console.log(` Is Adult:${user.isAdult}`);
    console.log(` Role: ${user.role}`);
    console.log(` Bio: ${user.bio}`);
    console.log(` Avatar: ${user.avatar}`);
});

section("TEST 2: filterByRole() - filter users by role");

const admins = filterByRole(users, "admin");

console.log(`\nAdmins (${admins.length}):`);

admins.forEach(u => console.log(` - ${u.firstName} ${u.lastName}`));



const editors = filterByRole(users, "editor");

console.log(`\nEditors (${editors.length}):`);

editors.forEach(u => console.log(`- ${u.firstName} ${u.lastName}`));


const viewers = filterByRole(users, "viewer");

console.log(`\nViewers (${viewers.length}):`);

viewers.forEach(u => console.log(` - ${u.firstName} ${u.lastName}`));

const allUsers = filterByRole(users);

console.log(`\nAll users (no role filter): ${allUsers.length} users`);

const upperCaseAdmins = filterByRole(users, "ADMIN");

console.log(`\nAdmins with "ADMIN" (case insensitive): ${upperCaseAdmins.length}`);

section("TEST 3: getUserStats() - analytics summary");

const stats = getUserStats(users);

console.log("\nUser statistics:");
console.log(`Total users: ${stats.total}`);
console.log(`Admins: ${stats.admins}`);
console.log(`Editors: ${stats.editors}`);
console.log(`Viewers: ${stats.viewers}`);
console.log(`Average age: ${stats.averageAge}`);
console.log(`Valid Roles :${ROLES.join(",")}`);

section("TEST 4: searchUsers() - search by name or role");

const showResults = (query, results) => {
    console.log(`\nSearch Results for: "${query}" ->  ${results.length} result(s)`);

    if (results.length === 0) {
        console.log(" No users found");
    } else {
        results.forEach(u =>
            console.log(` - ${u.firstName} ${u.lastName} (${results.length} result(s)`
            ));
    }
};

showResults("a", searchUsers(users, "a"));
showResults("carol", searchUsers(users, "carol"));
showResults("editor", searchUsers(users, "editor"));
showResults("xyz", searchUsers(users, "xyz"));
showResults(" ", searchUsers(users, " "));

section("BONES: Chain functions - admin stats only");

const adminOnly = filterByRole(users, "admin");
const adminStats = getUserStats(adminOnly);

const formattedAdmins = adminOnly.map(formatUser);

console.log(`\nAdmin-only Stats:`);
console.log(` Count :${adminStats.total}`);
console.log(` Average Age: ${adminStats.averageAge}`);
console.log(`  Names      : ${formattedAdmins.map(u => u.fullName).join(", ")}`);