-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 30, 2025 at 11:14 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pwl_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `subtasks`
--

CREATE TABLE `subtasks` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `is_completed` tinyint(1) DEFAULT 0,
  `estimated_minutes` int(11) DEFAULT 0,
  `target_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subtasks`
--

INSERT INTO `subtasks` (`id`, `task_id`, `title`, `is_completed`, `estimated_minutes`, `target_date`, `created_at`) VALUES
(3, 33, 'apace', 1, 10, '2025-12-29', '2025-12-27 19:58:57'),
(4, 33, 'apakah', 1, 12, '2025-12-23', '2025-12-27 19:59:19'),
(5, 34, 'qssq', 1, 20, '2025-12-26', '2025-12-27 20:01:05'),
(10, 37, 'Selesaikan segera', 1, 0, NULL, '2025-12-29 17:17:42'),
(11, 34, 'Cari referensi jurnal', 0, 0, NULL, '2025-12-29 17:25:54');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'To Do',
  `deadline` date DEFAULT NULL,
  `category` varchar(50) DEFAULT 'General'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `user_id`, `title`, `description`, `is_completed`, `created_at`, `status`, `deadline`, `category`) VALUES
(19, 6, 'sdad', 'dsd', 0, '2025-12-21 17:57:29', 'To Do', '2025-11-22', 'Development'),
(33, 1, 'apa', 'saya', 1, '2025-12-27 19:58:06', 'Done', '2025-12-29', 'Design'),
(34, 1, 'jahsja', 'snasn', 1, '2025-12-27 20:00:20', 'Done', '2025-12-27', 'Development'),
(37, 7, 'Selesaikan Laporan Bab 3', 'Deadline besok pagi harus selesai', 1, '2025-12-29 17:14:15', 'Done', '2025-12-30', 'Development'),
(38, 7, 'Laporan PKL', '', 1, '2025-12-29 18:05:13', 'Done', '2025-12-30', 'Personal'),
(39, 7, 'Membuat ERD', '', 0, '2025-12-29 18:18:02', 'To Do', '2025-12-31', 'Design');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `created_at`) VALUES
(1, 'Ressa arsy', 'ressa11@gmail.com', '$2b$10$UwjVlDJ3xu/CZgp2jowErOfjTuDHri6fNxn0hTw0FAKxUEuYODjNi', '2025-12-21 13:56:47'),
(6, 'Ressa Arsy', 'Ressa111@gmail.com', '$2b$10$3nTUuXN2NsAYrWXUfNKk9eb81FUm2m8wP5X3RKlo4/6//VCr10fKK', '2025-12-21 17:56:35'),
(7, 'Fitri Nufa', 'fnd@gmail.com', '$2b$10$8CK2fKIQZuSiWIUMsqcc1Ob5dq/DDHt0ctqFa3z7CpmuQS9ZiHZte', '2025-12-27 23:39:30'),
(14, 'Fitri Nufa Dastana', 'nufa@gmail.com', '$2b$10$5r.2Qi9v44umQNN5jexDieFKIDqpb0Jpz50yLf85GyQsp4mNte87q', '2025-12-29 17:39:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `subtasks`
--
ALTER TABLE `subtasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `subtasks`
--
ALTER TABLE `subtasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `subtasks`
--
ALTER TABLE `subtasks`
  ADD CONSTRAINT `subtasks_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
