"""
Duolingo Clone - SQLite Database Inspector
Usage:
    python backend/view_db.py            # Overview of all tables & row counts
    python backend/view_db.py <table_name>  # View contents of a specific table
Example:
    python backend/view_db.py exercises
    python backend/view_db.py units
    python backend/view_db.py users
"""

import sys
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "duolingo.db")

def main():
    if not os.path.exists(DB_PATH):
        print(f"Error: Database file not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;")
    tables = [row[0] for row in cur.fetchall()]

    args = sys.argv[1:]
    if not args:
        print("\n=======================================================")
        print(f"  DUOLINGO SQLITE DATABASE: {os.path.abspath(DB_PATH)}")
        print("=======================================================\n")
        print(f"{'Table Name':<20} | {'Rows':<8} | {'Columns'}")
        print("-" * 65)
        for t in tables:
            cur.execute(f"PRAGMA table_info({t});")
            cols = [c[1] for c in cur.fetchall()]
            cur.execute(f"SELECT COUNT(*) FROM {t};")
            count = cur.fetchone()[0]
            print(f"{t:<20} | {count:<8} | {', '.join(cols[:4])}{'...' if len(cols) > 4 else ''}")
        print("\nTip: To view rows inside a specific table, run:")
        print("  python backend/view_db.py <table_name>")
        print("  e.g.: python backend/view_db.py units\n")
        conn.close()
        return

    table_name = args[0]
    if table_name not in tables:
        print(f"Error: Table '{table_name}' does not exist.")
        print(f"Available tables: {', '.join(tables)}")
        conn.close()
        return

    cur.execute(f"PRAGMA table_info({table_name});")
    col_info = cur.fetchall()
    col_names = [c[1] for c in col_info]

    cur.execute(f"SELECT * FROM {table_name} LIMIT 50;")
    rows = cur.fetchall()

    print(f"\n=== TABLE: {table_name} ({len(rows)} rows shown) ===")
    print("Columns:", " | ".join(col_names))
    print("-" * 80)
    for r in rows:
        formatted = []
        for val in r:
            s = str(val) if val is not None else "NULL"
            if len(s) > 35:
                s = s[:32] + "..."
            formatted.append(s)
        print(" | ".join(formatted))
    print("-" * 80 + "\n")
    conn.close()

if __name__ == "__main__":
    main()
