package com.example.fileserver.controller;

import com.example.fileserver.model.File;
import com.example.fileserver.model.ResponseFile;
import com.example.fileserver.model.ResponseMessage;
import com.example.fileserver.service.FileStorageService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.printing.PDFPageable;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.imageio.ImageIO;
import javax.print.PrintService;
import javax.print.PrintServiceLookup;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.print.PrinterException;
import java.awt.print.PrinterJob;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.Buffer;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;


@CrossOrigin(origins = "*")
@Controller
public class FileStorageController {

    private FileStorageService storageService;

    public FileStorageController(final FileStorageService storageService) {
        this.storageService = storageService;
    }

    @RequestMapping("/")
    public String index() {
        return "index";
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        String message = "";
        try {
            var addedFile = storageService.store(file);
            var result = new ResponseFile(addedFile);
            System.out.println(result.getSize());
            System.out.println(result.getUrl());
            System.out.println(result.getType());
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseFile(addedFile));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("Uploading file failed");
        }
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/files")
    public ResponseEntity<List<ResponseFile>> getListFiles() {
        List<ResponseFile> files = storageService.getAllFiles().map(dbFile -> {
            String fileDownloadUri = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/files/")
                    .path(dbFile.getId())
                    .toUriString();

            return new ResponseFile(
                    dbFile.getId(),
                    dbFile.getName(),
                    fileDownloadUri,
                    dbFile.getType(),
                    dbFile.getData().length);
        }).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(files);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/files/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable String id) {
        File file = storageService.getFile(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .body(file.getData());
    }

    @DeleteMapping("files/{id}")
    public ResponseEntity deleteFile(@PathVariable String id){
        boolean result = storageService.deleteFileById(id);
        if(result){
            return new ResponseEntity(HttpStatus.OK);
        } else {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/printAll")
    public ResponseEntity printAllFiles() {
        List<ResponseFile> files = storageService.getAllFiles().map(dbFile -> {
            String fileDownloadUri = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/files/")
                    .path(dbFile.getId())
                    .toUriString();

            return new ResponseFile(
                    dbFile.getId(),
                    dbFile.getName(),
                    fileDownloadUri,
                    dbFile.getType(),
                    dbFile.getData().length);
        }).collect(Collectors.toList());

        try {
            PrintService printService = storageService.findPrintService("Brother DCP-195C");

            for (int i = 0; i < files.size(); i++) {
                URL url = new URL(files.get(i).getUrl());
                System.out.println(url);
                java.io.File file = new java.io.File("file" + i + ".pdf");
                org.apache.commons.io.FileUtils.copyURLToFile(url, file);
                PDDocument document = PDDocument.load(file);
                PrinterJob job = PrinterJob.getPrinterJob();
                job.setPageable(new PDFPageable(document));
                job.setPrintService(printService);
                job.print();
                document.close();
            }
//            PrintService[] printServices = PrintServiceLookup.lookupPrintServices(null, null);
//            for (PrintService printService : printServices) {
//                System.out.println(printService.getName());
//            }
        } catch (IOException | PrinterException e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.OK);
   }
}