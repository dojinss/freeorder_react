package com.aloha.freeorder.controller.pos;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.freeorder.domain.Files;
import com.aloha.freeorder.domain.Product;
import com.aloha.freeorder.service.FileService;
import com.aloha.freeorder.service.ProductService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

/**
 * REST 형식 컨트롤러
 * CRUD 비동기 처리
 * 
 */
@Slf4j
@RestController
@RequestMapping("/pos/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private FileService fileService;

    @Value("${upload.dir}") // application.properties 에서 지정한 업로드 경로 가져옴
    private String uploadPath;

    @GetMapping()
    public ResponseEntity<?> getAll(HttpServletRequest request) throws Exception {
        log.info("상품 목록 조회");
        String cateId = request.getParameter("cate");
        List<Product> productList = null;
        try {
            if (cateId == null || cateId.isEmpty()) {
                productList = productService.allList();
            } else {
                productList = productService.listByCate(cateId);
            }
            log.info(productList.toString());
            return new ResponseEntity<>(productList, HttpStatus.OK);
        } catch (Exception e) {
            log.error("상품 목록 조회 중 에러 발생...", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable("id") String id) throws Exception {
        log.info("상품 조회");
        try {
            Product product = productService.select(id);
            return new ResponseEntity<>(product, HttpStatus.OK);
        } catch (Exception e) {
            log.error("상품 조회 중 에러 발생...", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping()
    public ResponseEntity<?> create(Product product) throws Exception {
        log.info("상품 등록");
        log.info(product.toString());
        int result = 0;

        // 아이디 생성
        String id = UUID.randomUUID().toString();
        product.setId(id);
        String optionsId = product.getOptionsId();
        if(optionsId.equals("undefined") || optionsId.equals("null") || optionsId.equals("")){
            product.setOptionsId(null);
        }
        try {
            String productPath = uploadPath + product.getProductFile().getName();
            product.setProductImg(productPath);
            Files productFiles = new Files();
            productFiles.setFile(product.getProductFile());
            productFiles.setMain(false);
            productFiles.setParentId(id);
            productFiles.setParentTable("product");
            upload(productFiles);

            // 상품 등록
            result = productService.insert(product);
            if (result > 0)
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            else {
                log.info("상품 DB에 등록 중 에러 발생...");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            log.error("상품 등록 중 에러 발생...", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping
    public ResponseEntity<?> update(Product product) throws Exception {
        log.info("상품 수정");
        log.info(product.toString());
        int result = 0;

        // 아이디 생성
        String id = product.getId();
        fileDelete(id, "product");
        String optionsId = product.getOptionsId();
        if(optionsId.equals("undefined") || optionsId.equals("null") || optionsId.equals("")){
            product.setOptionsId(null);
        }
        try {
            String productPath = uploadPath + product.getProductFile().getName();
            product.setProductImg(productPath);
            Files productFiles = new Files();
            productFiles.setFile(product.getProductFile());
            productFiles.setMain(false);
            productFiles.setParentId(id);
            productFiles.setParentTable("product");
            upload(productFiles);

            // 상품 수정
            result = productService.update(product);
            if (result > 0) {
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            } else {
                log.info("상품 수정정 중 에러 발생...");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            log.error("상품 수정정 중 에러 발생...", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") String id) throws Exception {
        log.info("상품 삭제");
        try {
            int result = productService.delete(id);
            if (result > 0)
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            else {
                log.info("상품 DB에서 삭제 중 에러 발생...");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            log.error("상품 삭제 중 에러 발생...", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/locate")
    public ResponseEntity<?> saveProductOrder(@RequestBody List<Product> productList) {
        Map<String, String> response = new HashMap<>();
        try {
            // 로그 추가
            System.out.println("Received product list: " + productList);

            productService.updateProductOrder(productList);
            response.put("status", "SUCCESS");
            response.put("message", "순서가 성공적으로 업데이트 되었습니다.");
            return ResponseEntity.ok(response); // 200 OK 응답
        } catch (Exception e) {
            e.printStackTrace();
            response.put("status", "FAIL");
            response.put("message", "순서 업데이트에 실패했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // 500 Internal Server Error
                                                                                           // 응답
        }
    }

    public boolean upload(Files file) throws Exception {
        log.info("file : " + file);

        // 파일 정보
        MultipartFile mf = file.getFile();
        String origninName = mf.getOriginalFilename();
        long fileSize = mf.getSize();
        byte[] fileData = mf.getBytes();

        log.info("원본파일명 : " + origninName);
        log.info("파일용량 : " + fileSize);
        log.info("파일데이터 : " + fileData);

        // 파일 업로드
        // 파일 데이터를 업로드 경로에 복사
        // 업로드된 파일 정보를 DB 에 등록

        // 파일 복사
        // * 파일명 중복 방지 : 파일명 앞에 날짜데이터 또는 UID 를 붙여준다.
        String fileName = UUID.randomUUID().toString() + "_" + origninName;
        File uploadFile = new File(uploadPath, fileName);
        // 파일 경로 : C:/upload/UID_강아지.png
        // FileCopyUtils.copy(파일데이터, 파일객체);
        if (!uploadFile.exists()) {
            FileCopyUtils.copy(fileData, uploadFile); // 파일 업로드
        }

        // DB 등록
        file.setName(fileName);
        file.setOriginName(origninName);
        file.setPath(uploadFile.getPath());
        file.setSize(fileSize);
        fileService.insert(file);

        return true;
    }

    public boolean fileDelete(String id, String table) throws Exception {
        List<Files> fileList = fileService.list(id, table);
        for (Files files : fileList) {
            File file = new File(files.getPath());
            if (file.exists()) {
                file.delete();
            }
        }
        int result = fileService.allDelete(id, table);
        if (result > 0) {
            return true;
        } else
            return false;
    }

}
