-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 22, 2025 at 12:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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
(11, 1, 'aaa', 'aaa', 0, '2025-12-21 15:49:10', 'In Progress', '2025-12-21', 'Design'),
(12, 1, 'bbb', 'bbb', 1, '2025-12-21 15:49:50', 'Done', '2025-12-22', 'General'),
(13, 1, 'ccc', 'ccc', 0, '2025-12-21 15:53:00', 'In Progress', '2025-11-30', 'Development'),
(14, 1, 'ddd', 'sss', 0, '2025-12-21 15:53:38', 'In Progress', '2025-12-28', 'Marketing'),
(15, 1, 'sss', 'sss', 1, '2025-12-21 15:54:32', 'Done', '2025-12-12', 'Personal'),
(17, 1, 'rrrr', 'aaaaa', 0, '2025-12-21 16:53:49', 'To Do', '2025-11-12', 'Marketing'),
(18, 1, 'asd', 'addd', 0, '2025-12-21 17:37:08', 'To Do', '2025-12-25', 'Marketing'),
(19, 6, 'sdad', 'dsd', 0, '2025-12-21 17:57:29', 'To Do', '2025-11-22', 'Development'),
(20, 1, 'zdfzd', 'hdsjhjkshk', 0, '2025-12-21 18:33:39', 'In Progress', '2025-12-22', 'Personal'),
(21, 1, 'sassf', '', 1, '2025-12-21 18:34:01', 'Done', '2025-12-22', 'Marketing'),
(22, 1, 'dfsd', 'daSD', 1, '2025-12-21 18:34:21', 'Done', '2025-12-23', 'Marketing'),
(23, 1, 'DFSA', 'dada', 1, '2025-12-21 18:37:51', 'Done', '2025-12-28', 'Development'),
(24, 1, 'fryty', '', 0, '2025-12-21 18:38:14', 'In Progress', '2025-12-27', 'Development'),
(25, 1, 'dada', 'dda', 0, '2025-12-21 18:38:41', 'In Progress', '2025-12-27', 'Marketing'),
(26, 1, 'DASD', '', 1, '2025-12-21 18:39:02', 'Done', '2025-12-27', 'Development'),
(27, 1, 'DSD', '', 0, '2025-12-21 18:39:29', 'In Progress', '2025-12-26', 'Development'),
(28, 1, 'DAD', 'ASA', 1, '2025-12-21 18:39:47', 'Done', '2025-12-26', 'Development'),
(29, 1, 'DSAD', 'SDS', 1, '2025-12-21 18:40:15', 'Done', '2025-12-26', 'Personal'),
(30, 1, 'asd', 'ass', 1, '2025-12-21 18:40:35', 'Done', '2025-12-26', 'Development');

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
(6, 'Ressa Arsy', 'Ressa111@gmail.com', '$2b$10$3nTUuXN2NsAYrWXUfNKk9eb81FUm2m8wP5X3RKlo4/6//VCr10fKK', '2025-12-21 17:56:35');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
