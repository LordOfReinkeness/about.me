# Terminal Portfolio - High Level Overview

## What It Does

A website that looks and behaves like a terminal. Users type commands to view different sections of your CV.

## User Flow

1. User arrives → sees welcome message + prompt
2. User types command (e.g., `education`) → content displays
3. User types another command → more content stacks on top
4. History builds up, can be cleared with `clear` command

## Content System

**Each command maps to a content file:**
- `about` → about file
- `education` → education file
- `projects` → projects file
- etc.

**File types:**
- Text/Markdown for paragraphs
- JSON for structured lists
- ASCII art for logo/decorations

## Adding Content

To add new section:
1. Create content file
2. Map command to file
3. Done

To update content:
1. Edit file
2. Redeploy

## Core Behavior

- Commands execute and show output
- Output stacks (terminal history)
- Arrow keys navigate command history
- Links are clickable
- Unknown commands show error

---

**Summary:** Content lives in files, commands load and display those files in a terminal interface.