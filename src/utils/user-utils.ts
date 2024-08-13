import {
  isPossibleNumber,
  isSupportedCountry,
  isValidNumber,
  isValidPhoneNumber,
} from "libphonenumber-js"
import { prisma } from "./prisma"

/**
 * Generates a unique username by checking against existing usernames in the database.
 * If the username already exists, appends a number to make it unique.
 * @param {string} name - The user's full name.
 * @returns {Promise<string>} - The generated unique username.
 */

export const generateUsername = async (name: string): Promise<string> => {
  const parts = name.trim().split(/\s+/)
  const firstName = parts[0].toLowerCase()
  const lastName = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ""
  let baseUsername = `${firstName}_${lastName}`
  let username = baseUsername
  let counter = 1

  // Check if the username exists in the database
  let existingProfile = await prisma.profile.findUnique({ where: { username } })

  // Append a number until a unique username is found
  while (existingProfile) {
    username = `${baseUsername}${counter}`
    counter++
    existingProfile = await prisma.profile.findUnique({ where: { username } })
  }

  return username
}

/**
 * Generates initials based on the user's name.
 * The initials are created by taking the first letter of each word in the name.
 * @param {string} name - The user's full name.
 * @returns {string} - The generated initials.
 */
export const generateInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  return parts.map((part: string) => part[0].toUpperCase()).join("")
}

export const parseIdentifier = (identifier: string) => {
  let field
  let value

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9._-]*$/

  if (identifier.match(emailRegex)) {
    field = "email"
    value = identifier.toLowerCase().trim()
  }

  if (identifier.match(usernameRegex)) {
    field = "username"
    value = identifier.toLowerCase().trim()
  }

  return {
    field,
    value,
  }
}
