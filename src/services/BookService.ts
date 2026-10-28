import type { BookModel } from "../models/BookModel";
import type { ReviewModel } from "../models/ReviewModel";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BookResponse {
  content: BookModel[];
  page: {
    totalElements: number;
    totalPages: number;
  };
}

interface ReviewResponse {
  content: ReviewModel[];
  page: {
    totalElements: number;
    totalPages: number;
  };
}

export const bookService = {
  async getBooks(pageNo: number, pageSize: number): Promise<BookResponse> {
    const response = await fetch(
      `${BASE_URL}/books?pageNo=${pageNo}&pageSize=${pageSize}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    const data: BookResponse = await response.json();
    return data;
  },

  async searchBooksByTitle(
    title: string,
    pageNo: number,
    pageSize: number,
  ): Promise<BookResponse> {
    const response = await fetch(
      `${BASE_URL}/books/search/title?title=${encodeURIComponent(title)}&pageNo=${pageNo}&pageSize=${pageSize}`,
    );

    if (!response.ok) {
      throw new Error("Failed to search books by title");
    }

    return response.json();
  },

  async searchBooksByCategory(
    category: string,
    pageNo: number,
    pageSize: number,
  ): Promise<BookResponse> {
    const response = await fetch(
      `${BASE_URL}/books/search/category?category=${encodeURIComponent(category)}&pageNo=${pageNo}&pageSize=${pageSize}`,
    );

    if (!response.ok) {
      throw new Error("Failed to search books by category");
    }

    return response.json();
  },

  async getBookById(id: string): Promise<BookModel> {
    const response = await fetch(`${BASE_URL}/books/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch book by ID");
    }

    return response.json();
  },

  async getBookReviewsById(
    bookId: string,
    pageNo: number = 0,
    pageSize: number = 3,
  ): Promise<ReviewResponse> {
    const response = await fetch(
      `${BASE_URL}/reviews/book/${bookId}?pageNo=${pageNo}&pageSize=${pageSize}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch reviews for the book");
    }

    return response.json();
  },
};
